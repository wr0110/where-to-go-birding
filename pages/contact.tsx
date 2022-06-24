import * as React from "react";
import PageHeading from "components/PageHeading";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "components/Input";
import Textarea from "components/Textarea";
import Form from "components/Form";
import Submit from "components/Submit";
import Title from "components/Title";
import Field from "components/Field";
import { CheckCircleIcon } from "@heroicons/react/outline";
import useRecaptcha from "hooks/useRecaptcha";

type Inputs = {
  locationId: string;
};

export default function Contact() {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const form = useForm<Inputs>();
  useRecaptcha();

  const post = async (data: any) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const json = await response.json();
      setLoading(false);
      if (json.success) {
        setSuccess(true);
        form.reset();
        return;
      }
      alert("Error submitting form");
    } catch (error) {
      alert("Error submitting form");
    }
  };

  const handleSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    setSuccess(false);
    // @ts-ignore
    window.grecaptcha.ready(() => {
      // @ts-ignore
      window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_KEY, { action: "submit" }).then((token: string) => {
        console.log("TOKEN", token);
        post({ ...data, token });
      });
    });
  };

  return (
    <div className="container pb-16 mt-12">
      <Title>How to Help</Title>
      <PageHeading breadcrumbs={false}>How to Help</PageHeading>

      <Form form={form} onSubmit={handleSubmit}>
        <div className="max-w-2xl mx-auto">
          <p className="mb-4">
            Please send comments, questions about this website , corrections, or additional information on locations by
            filling out the contact form below.
          </p>
          <div className="py-5 bg-white space-y-6">
            <div className="flex gap-4">
              <Field label="Name">
                <Input type="text" name="name" />
              </Field>
              <Field label="Email">
                <Input type="email" name="email" />
              </Field>
            </div>
            <Field label="Message">
              <Textarea name="message" rows={7} />
            </Field>
          </div>
          {success && (
            <p className="border border-lime-600/90 rounded p-4 text-gray-600 mb-6">
              <CheckCircleIcon className="h-6 w-6 inline-block text-lime-600/90 mr-2" />
              Thank you for your message. We will get back to you as soon as possible.
            </p>
          )}
          <div className="px-4 py-3 mt-2 bg-gray-100 text-right sm:px-6 rounded">
            <Submit color="green" className="font-medium" loading={loading}>
              Submit
            </Submit>
          </div>
        </div>
      </Form>
    </div>
  );
}
