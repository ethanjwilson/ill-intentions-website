import { useFormContext } from "react-hook-form";
import DeliveryDetailForm from "./DeliveryDetailForm";
import ShippingDetailsForm from "./ShippingDetailsForm";
import UserDetailForm from "./UserDetailForm";

const CheckoutForm = () => {
  return (
    <>
      <DeliveryDetailForm />
      <UserDetailForm />
      <ShippingDetailsForm />
    </>
  );
};

export default CheckoutForm;
