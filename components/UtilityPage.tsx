import * as React from "react";
import Title from "components/Title";
import Logo from "components/Logo";

type PropTypes = {
  heading: string;
  children: React.ReactNode;
};

export default function UtilityPage({ heading, children }: PropTypes) {
  React.useEffect(() => {
    document.documentElement.classList.add("h-full", "bg-gray-50");
    document.body.classList.add("h-full");
    return () => {
      document.documentElement.classList.remove("h-full", "bg-gray-50");
      document.body.classList.remove("h-full");
    };
  }, []);

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8 md:min-h-[800px]">
      <Title>{heading}</Title>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Logo className="mx-auto h-16 w-auto" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">{heading}</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">{children}</div>
      </div>
    </div>
  );
}
