import CustomerForm from "./CustomerForm";
import DeliveryForm from "./DeliveryForm";
import ShippingForm from "./ShippingForm";

const CheckoutForm = () => {
  return (
    <>
      <DeliveryForm />
      <CustomerForm />
      <ShippingForm />
    </>
  );
};

export default CheckoutForm;
