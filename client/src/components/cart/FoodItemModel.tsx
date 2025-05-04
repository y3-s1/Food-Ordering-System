"use client"

import type React from "react"
import { useState } from "react"
import { Minus, Plus, X } from "lucide-react"
import type { CartItem } from "../../types/cart/cart"
import ModalPortal from "../common/ModalPortal"
import { Button } from "../ui/button"
// import { Textarea } from "../ui/textarea"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { cn } from "../../utils/utils"

interface FoodItemModalProps {
  item: CartItem
  onClose: () => void
  onUpdate: (updatedItem: CartItem) => void
  onRemove: (id: string) => void
}

const FoodItemModal: React.FC<FoodItemModalProps> = ({ item, onClose, onUpdate, onRemove }) => {
  const [quantity, setQuantity] = useState<number>(item.quantity)
  // const [notes, setNotes] = useState<string>(item.notes || "")

  const basePrice = item.unitPrice
  const getTotalPrice = () => basePrice * quantity

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleUpdateClick = () => {
    onUpdate({
      ...item,
      quantity,
      // notes,
      unitPrice: basePrice,
    })
    onClose()
  }

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onRemove(item._id)
    onClose()
  }

  const incrementQuantity = () => {
    if (quantity < 10) setQuantity(quantity + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-4 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <div
          className="bg-white max-w-3xl w-full rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex p-4 items-center border-b">
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-gray-100">
              <X size={20} className="text-gray-600" />
              <span className="sr-only">Close</span>
            </Button>
            <h3 className="text-lg font-medium ml-2">Edit Item</h3>
            <div className="ml-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveClick}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                Remove
              </Button>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-col md:flex-row">
            {/* Image */}
            <div className="w-full md:w-1/2 relative">
              <div className="aspect-square overflow-hidden">
                <img
                  src={item.imageUrl || "/placeholder.svg?height=400&width=400"}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
              </div>
              <Badge className="absolute top-4 left-4 bg-black/80 hover:bg-black/90">LKR {basePrice.toFixed(2)}</Badge>
            </div>

            {/* Details */}
            <div className="w-full md:w-1/2 p-6 flex flex-col">
              <h2 className="text-2xl font-bold mb-2">{item.name}</h2>

              <Separator className="my-4" />

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Quantity</label>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="h-10 w-10 rounded-full"
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="mx-4 w-8 text-center font-medium text-lg">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={incrementQuantity}
                    disabled={quantity >= 10}
                    className="h-10 w-10 rounded-full"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>

              {/* Notes */}
              {/* <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Special Instructions</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add a note (e.g., no onions, extra spicy)"
                  className="resize-none h-24"
                />
              </div> */}

              {/* Display added notes */}
              {/* {notes && (
                <div className="mb-6 bg-amber-50 p-3 rounded-lg border border-amber-100">
                  <p className="text-amber-800 text-sm">
                    <span className="font-semibold">Note:</span> {notes}
                  </p>
                </div>
              )} */}

              <div className="mt-auto">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600 font-medium">Total</span>
                  <span className="text-xl font-bold">LKR {getTotalPrice().toFixed(2)}</span>
                </div>

                {/* Actions */}
                <Button
                  onClick={handleUpdateClick}
                  className={cn("w-full py-6 text-base font-medium mb-2", "bg-black hover:bg-gray-800 text-white")}
                >
                  Update Order
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  )
}

export default FoodItemModal
