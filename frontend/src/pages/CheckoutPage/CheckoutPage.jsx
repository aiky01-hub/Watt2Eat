import BackButton from '@/components/BackButton'
import React, { useEffect } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useAdvertStore } from '@/store/advertStore'
import { useCartStore } from '@/store/cartStore';
import { useNavigate, useParams } from 'react-router-dom'
import BIKE from '/Bike.png'
import { format } from 'date-fns'

const CheckoutPage = () => {
  const navigate = useNavigate()

  const { selectedAdvert, fetchAdvertById, isAdvertLoading } = useAdvertStore()
  const { addToCart, cartItems, updateQuantity, getTotalPrice } = useCartStore(); // Cart actions
  const { id } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        await fetchAdvertById(id);
      }
    };
    fetchData();
  }, [id, fetchAdvertById]);

  // Handle loading state
  if (isAdvertLoading || !selectedAdvert) {
    // TODO: Replace with a proper laoding page for all the other pages with laoding states
    return <div className="p-6">Fetching advert...</div>
  }

  console.log(selectedAdvert)

  const formattedTime = format(new Date(selectedAdvert.estimatedReturnTime), 'h:mm a')

  return (
    <div className="flex flex-col h-full w-full relative bg-white items-center">
      {/* Header */}
      <div className="font-poppins pt-8 px-6 flex flex-col w-full">
        <div className='relative'>
          <BackButton />
          <div className="flex flex-col text-black pl-10">
            <p className="text-md font-bold">Checkout</p>
            <p className="text-sm font-light text-mutedText">{selectedAdvert.restaurant.name}</p>
          </div>
        </div>
        <Breadcrumb className="mt-4 flex justify-center items-center">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => { navigate(`/advert/${id}`) }} className="cursor-pointer">Menu</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => { navigate(`/order-summary/${id}`) }} className="cursor-pointer">Cart</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Checkout</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Body */}
      <div className='flex-1 w-full px-8 pt-8 flex flex-col gap-6'>
        <div>
          <p className='text-greyText font-poppins font-semibold text-sm mb-1'>Delivery Details</p>
          <div className='border-2 border-gray-300 text-black rounded-lg flex p-4 justify-center items-center gap-4'>
            <img src={BIKE} />
            <div className='flex flex-col font-poppins gap-2'>
              <div>
                <p className='text-xs text-mutedText font-medium'>Delivery Time</p>
                <p className='font-bold text-mainBlue'>{formattedTime}</p>
              </div>
              <div>
                <p className='text-xs text-mutedText font-medium'>Delivered To</p>
                <p className='text-xs text-mainBlue font-bold'>365 Room, West Wing, Level 2, Heriot-Watt</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p className='text-greyText font-poppins font-semibold text-sm mb-1'>Order Summary</p>
          <div className='border-2 border-gray-300 text-black rounded-lg flex p-4 justify-center items-center flex-col font-poppins'>
            <div className="flex flex-col justify-between w-full">
              {
                cartItems.map((item) => (
                  <div key={item._id} className='flex w-full justify-between text-mutedText pb-2 font-bold'>
                    <div className='font-poppins text-sm'>{item.quantity}x {item.name}</div>
                    <div className='font-poppins text-sm'>RM {(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))
              }
            </div>
            <div className='border border-gray-200 w-full' />
            <div className='flex flex-col w-full font-poppins font-medium text-mutedText gap-2 text-sm py-3'>
              <div className='flex w-full justify-between'>
                <div>Subtotal</div>
                <div>RM {getTotalPrice()}</div>
              </div>
              <div className='flex w-full justify-between'>
                <div>Delivery & Processing Fee</div>
                <div>RM 6</div>
              </div>
            </div>
            <div className='border border-gray-200 w-full' />
            <div className='flex w-full justify-between font-bold items-center pt-3'>
              <div className=''>Total</div>
              <div>RM {getTotalPrice() + 6}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className='w-full bg-white border-t border-gray-200 p-4'>
        <button className='w-full bg-mainBlue text-white py-3 rounded-lg font-bold'>
          Place Order
        </button>
      </div>
    </div>
  )
}

export default CheckoutPage