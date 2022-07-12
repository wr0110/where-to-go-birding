import * as React from "react";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "components/Input";
import Form from "components/Form";
import Submit from "components/Submit";
import Title from "components/Title";
import Field from "components/Field";

type Inputs = {
  locationId: string;
};

export default function Add() {
  const form = useForm<Inputs>();
  const router = useRouter();
  const { defaultParentId } = router.query;
  const [loading, setLoading] = React.useState(false);

  const handleSubmit: SubmitHandler<Inputs> = async ({ locationId }) => {
    setLoading(true);
    const url = defaultParentId ? `/edit/${locationId}?defaultParentId=${defaultParentId}` : `/edit/${locationId}`;
    router.push(url);
  };

  return (
    <div className="container pb-16 my-12">
      <Title>Add Hotspot</Title>
      <Form form={form} onSubmit={handleSubmit}>
        <div className="max-w-2xl mx-auto">
          <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
            <Field label="eBird Location ID">
              <Input type="text" name="locationId" />
              <span className="text-xs text-gray-500 font-normal">Example: L12345678</span>
            </Field>
          </div>
          <div className="px-4 py-3 bg-gray-100 text-right sm:px-6 rounded">
            <Submit loading={loading} color="green" className="font-medium">
              Continue
            </Submit>
          </div>
        </div>
      </Form>
    </div>
  );
}
