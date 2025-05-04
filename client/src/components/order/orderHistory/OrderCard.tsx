import type React from "react"

import { Badge } from "../../ui/badge"
import { Button } from "../../ui/button"
import { Separator } from "../../ui/separator"
import { formatDate } from "../../../utils/utils"
import type { OrderDTO } from "../../../types/order/order"
import { useEffect, useState } from "react"
import { IRestaurant } from "../../../types/restaurant/restaurant"
import { getRestaurantById } from "../../../services/resturent/restaurantService"
import { useNavigate } from "react-router-dom"

interface OrderCardProps {
  order: OrderDTO
  showCompletePayment?: boolean
}

export default function OrderCard({ order, showCompletePayment }: OrderCardProps) {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);

  const subtotal = order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const discountAmount = 0
  const { deliveryFee, serviceFee, tax } = order.fees ?? { deliveryFee: 0, serviceFee: 0, tax: 0 }
  const feesTotal = deliveryFee + serviceFee + tax
  const total = subtotal - discountAmount + feesTotal

  useEffect(() => {
    if (order.restaurantId) {
      getRestaurantById(order.restaurantId)
        .then(res => setRestaurant(res))
        .catch(err => console.error('Failed to load restaurant', err));
    }
  }, [order.restaurantId]);

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(`/order/${order._id}`)
  }

  const handleCompletePayment = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate('/checkout', { state: { orderId: order._id, amount: Math.round(total * 100) } });
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-600"
      case "processing":
        return "bg-blue-100 text-blue-600"
      case "pending":
        return "bg-yellow-100 text-yellow-600"
      case "cancelled":
        return "bg-red-100 text-red-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5"
      onClick={() => navigate(`/order/${order._id}`)}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Left side - Image */}
        <div className="flex-shrink-0">
          <img
            src={order.items[0]?.imageUrl || "/placeholder.svg?height=100&width=100"}
            alt="Food item"
            className="w-20 h-20 rounded-lg object-cover"
          />
        </div>

        {/* Right side - Content */}
        <div className="flex-1">
          {/* Restaurant and Order Info */}
          <div className="flex justify-between items-start">
            <div className="text-left">
              <h3 className="font-medium text-gray-900">{restaurant?.name || "Restaurant"}</h3>
              <p className="text-sm text-gray-500">{restaurant?.address || "Location"}</p>
              <p className="text-sm font-medium mt-1">ORDER #{order._id.slice(-6)}</p>
            </div>

            <div className="text-right">
              <Badge className={`${getStatusColor(order.status)} font-medium`}>{order.status}</Badge>
              <p className="text-xs text-gray-500 mt-1.5">{formatDate(order.createdAt)}</p>
            </div>
          </div>

          {/* View Details Link */}
          <Button className="text-black bg-white p-2 h-auto mt-1 font-normal" onClick={handleViewDetails}>
            View Details
          </Button>

          <Separator className="my-3" />

          {/* Order Items */}
          <div className="space-y-1">
            {order.items.map((item) => (
              <div key={item.menuItemId} className="flex justify-between">
                <p className="text-sm text-gray-700">
                  {item.name} <span className="text-gray-500">x {item.quantity}</span>
                </p>
              </div>
            ))}
          </div>

          {/* Total Payment */}
          <div className="flex justify-between items-center mt-4">
            <span className="font-medium text-gray-900">Total Payment</span>
            <span className="font-semibold text-gray-900">LKR {order.totalPrice.toFixed(2)}</span>
          </div>

          {/* Complete Payment Button (conditional) */}
          {showCompletePayment && (
            <div className="mt-3">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleCompletePayment}>
                Complete Payment
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}