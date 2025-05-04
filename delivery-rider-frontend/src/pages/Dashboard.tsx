"use client"

import { useCallback, useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import type { Delivery } from "../types/delivery"
import { getDeliveriesByDriver, updateDeliveryStatus } from "../api/delivery"
import { updateDriverLocation } from "../api/driver"
import toast from "react-hot-toast"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import type { Map as LeafletMap } from "leaflet"
import L from "leaflet"
import { calculateDistance } from "../utils/geo"
import NavigateButton from "../components/NavigateButton"
import RiderStatusToggle from "../components/RiderStatusToggle"
import { addHoursToDate } from "../utils/date"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog"
import { Loader2, MapPin, Clock, Package, Navigation, CheckCircle, AlertCircle } from "lucide-react"
import { Separator } from "../components/ui/separator"

const Dashboard = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingDeliveryId, setUpdatingDeliveryId] = useState<string | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [activeDelivery, setActiveDelivery] = useState<Delivery | null>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const [zoomLevel, setZoomLevel] = useState<number>(15)
  const [distanceToDelivery, setDistanceToDelivery] = useState<number | null>(null)
  const navigate = useNavigate()
  const [isOnline, setIsOnline] = useState(true)
  const [driverId, setDriverId] = useState("")
  const [confirmModal, setConfirmModal] = useState<{
    visible: boolean
    deliveryId: string | null
  }>({ visible: false, deliveryId: null })

  const riderIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  })

  const deliveryIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3177/3177361.png",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  })

  useEffect(() => {
    const rider = JSON.parse(localStorage.getItem("rider") || "{}")
    if (!rider) {
      toast.error("You must be logged in.")
      navigate("/login")
    }
    setDriverId(rider._id)
  }, [navigate])

  const fetchData = useCallback(async () => {
    try {
      const data = await getDeliveriesByDriver(driverId)

      // Sort deliveries by status priority and createdAt (oldest first within same status)
      const sortedData = [...data].sort((a, b) => {
        const statusOrder = {
          OUT_FOR_DELIVERY: 1,
          ASSIGNED: 2,
          DELIVERED: 3,
          PENDING: 4,
        }

        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[a.status] - statusOrder[b.status]
        }

        // Flip the comparison to show oldest first
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      })

      setDeliveries(sortedData)

      const active = sortedData.find((d) => d.status === "OUT_FOR_DELIVERY")
      if (active) {
        setActiveDelivery(active)
        setZoomLevel(9)
      } else {
        setActiveDelivery(null)
        setZoomLevel(15)
      }
    } catch (error) {
      console.error("Failed to fetch deliveries", error)
    } finally {
      setLoading(false)
    }
  }, [driverId])

  useEffect(() => {
    if (!driverId) return
    fetchData()
  }, [fetchData, driverId])

  useEffect(() => {
    if (!driverId || !navigator.geolocation) return

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser")
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setCurrentPosition({ lat: latitude, lng: longitude })
        try {
          await updateDriverLocation(driverId, latitude, longitude)
          console.log("Location updated:", latitude, longitude)
        } catch (error) {
          console.error("Failed to update location", error)
        }
      },
      (error) => {
        setLocationError("Failed to get your location")
        console.error("Error getting location:", error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      },
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [driverId])

  useEffect(() => {
    if (mapRef.current && currentPosition) {
      mapRef.current.flyTo([currentPosition.lat, currentPosition.lng], zoomLevel, {
        animate: true,
        duration: 1.5,
      })
    }
  }, [zoomLevel, currentPosition])

  useEffect(() => {
    if (currentPosition && activeDelivery?.location) {
      const distance = calculateDistance(
        currentPosition.lat,
        currentPosition.lng,
        activeDelivery.location.lat,
        activeDelivery.location.lng,
      )
      setDistanceToDelivery(distance)
    } else {
      setDistanceToDelivery(null)
    }
  }, [currentPosition, activeDelivery])

  const hasActiveDeliveries = deliveries.some((d) => d.status === "ASSIGNED" || d.status === "OUT_FOR_DELIVERY")

  const visibleDeliveries = isOnline ? deliveries : deliveries.filter((d) => d.status === "DELIVERED")

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    if (newStatus === "OUT_FOR_DELIVERY") {
      // Check if rider already has an active delivery
      const alreadyOutForDelivery = deliveries.some((d) => d.status === "OUT_FOR_DELIVERY")
      if (alreadyOutForDelivery) {
        toast.error("You already have an active delivery. Complete it first.")
        return
      }
    }

    setUpdatingDeliveryId(id)
    const toastId = toast.loading(newStatus === "DELIVERED" ? "Marking as Delivered..." : "Starting Delivery...")
    try {
      await updateDeliveryStatus(id, newStatus)

      await fetchData() // Refresh dashboard

      toast.success(newStatus === "DELIVERED" ? "Delivered successfully!" : "🚚 Marked as Out for Delivery", {
        id: toastId,
      })
    } catch (error) {
      console.error("Failed to update status", error)
      toast.error("Failed to update delivery status", { id: toastId })
    } finally {
      setUpdatingDeliveryId(null)
    }
  }

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "OUT_FOR_DELIVERY":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200"
      case "ASSIGNED":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      default:
        return "bg-slate-100 text-slate-800 hover:bg-slate-200"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading deliveries...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <Package className="h-5 w-5" /> Delivery Dashboard
            </CardTitle>
            <Badge variant={isOnline ? "success" : "destructive"} className="text-xs">
              {isOnline ? "ONLINE" : "OFFLINE"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          {locationError && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{locationError}</span>
            </div>
          )}

          <RiderStatusToggle
            isOnline={isOnline}
            setIsOnline={setIsOnline}
            hasActiveDeliveries={hasActiveDeliveries}
            driverId={driverId}
          />
        </CardContent>
      </Card>

      {currentPosition && (
        <Card className="mb-6 overflow-hidden">
          <CardContent className="p-0">
            <div className="h-64 w-full">
              <MapContainer
                center={[currentPosition.lat, currentPosition.lng]}
                zoom={zoomLevel}
                scrollWheelZoom={false}
                className="h-full w-full"
                ref={(mapInstance: LeafletMap) => {
                  mapRef.current = mapInstance
                }}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Rider Marker */}
                <Marker position={[currentPosition.lat, currentPosition.lng]} icon={riderIcon}>
                  <Popup>🚴‍♂️ You (Rider)</Popup>
                </Marker>

                {/* Delivery Destination Marker */}
                {activeDelivery && activeDelivery.location && (
                  <Marker position={[activeDelivery.location.lat, activeDelivery.location.lng]} icon={deliveryIcon}>
                    <Popup>📦 Delivery Destination</Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          </CardContent>
          {distanceToDelivery !== null && (
            <CardFooter className="py-3 flex justify-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Navigation className="h-4 w-4" />
                <span>
                  Distance to Delivery: <span className="font-semibold">{distanceToDelivery.toFixed(2)} km</span>
                </span>
              </div>
            </CardFooter>
          )}
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 px-1">
          {visibleDeliveries.length > 0 ? "Your Deliveries" : "No deliveries available"}
        </h2>

        {visibleDeliveries.map((delivery) => (
          <Card
            key={delivery._id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={(e) => {
              if ((e.target as HTMLElement).tagName.toLowerCase() !== "button") {
                navigate(`/delivery/${delivery._id}`)
              }
            }}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Delivery ID:</span>
                  <span className="text-xs font-medium text-primary truncate max-w-[180px] md:max-w-[300px]">
                    {delivery._id}
                  </span>
                </div>
                <Badge className={getStatusBadgeStyles(delivery.status)}>{delivery.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-sm">{delivery.deliveryAddress}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    ETA: {addHoursToDate(delivery.createdAt, 1).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </CardContent>
            <Separator />
            <CardFooter className="pt-3 pb-3 flex gap-2 justify-end">
              {delivery.status === "ASSIGNED" && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleStatusUpdate(delivery._id, "OUT_FOR_DELIVERY")
                  }}
                  disabled={updatingDeliveryId === delivery._id}
                  variant="default"
                  size="sm"
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  {updatingDeliveryId === delivery._id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Start Delivery"
                  )}
                </Button>
              )}

              {delivery.status === "OUT_FOR_DELIVERY" && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    setConfirmModal({ visible: true, deliveryId: delivery._id })
                  }}
                  disabled={updatingDeliveryId === delivery._id}
                  variant="default"
                  size="sm"
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  {updatingDeliveryId === delivery._id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark Delivered
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {isOnline && <NavigateButton currentPosition={currentPosition} deliveries={deliveries} />}

      <AlertDialog
        open={confirmModal.visible}
        onOpenChange={(open) => {
          if (!open) setConfirmModal({ visible: false, deliveryId: null })
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delivery</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this delivery as <span className="font-semibold">Delivered</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (confirmModal.deliveryId) {
                  await handleStatusUpdate(confirmModal.deliveryId, "DELIVERED")
                }
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              Yes, Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Dashboard
