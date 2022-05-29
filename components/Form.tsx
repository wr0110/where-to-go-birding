import { FormProvider, FormProviderProps } from "react-hook-form";

type FormProps = {
	children: React.ReactNode,
	form: any,
	onSubmit: (callback: any) => void,
	[x:string]: any;
}

export default function Form({children, form: { handleSubmit, ...form }, onSubmit, ...props}: FormProps) {
	return (
		<FormProvider {...form}>
			<form onSubmit={handleSubmit(onSubmit)} {...props}>
				{children}
			</form>
		</FormProvider>
	)
}