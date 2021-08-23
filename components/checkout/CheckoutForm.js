import CustomerForm from "./CustomerForm";
import DeliveryForm from "./DeliveryForm";
import ShippingForm from "./ShippingForm";

const CheckoutForm = ({ disabled }) => {
  return (
    <>
      <DeliveryForm {...{ disabled }} />
      <CustomerForm {...{ disabled }} />
      <ShippingForm {...{ disabled }} />
    </>
  );
};

export default CheckoutForm;
