import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "components/Input";
import Form from "components/Form";
import Submit from "components/Submit";

type Inputs = {
	locationId: string,
};

export default function Add() {
	const form = useForm<Inputs>();
	const router = useRouter();
	const { defaultParentId } = router.query;

	const handleSubmit: SubmitHandler<Inputs> = async ({locationId}) => {
		const url = defaultParentId ? `/edit/${locationId}?defaultParentId=${defaultParentId}` : `/edit/${locationId}`;
		router.push(url);
	}

	return (
		<div className="container pb-16 my-12">
			<Form form={form} onSubmit={handleSubmit}>
				<div className="max-w-2xl mx-auto">
					<div className="px-4 py-5 bg-white space-y-6 sm:p-6">
						<div>
							<label className="text-gray-500 font-bold">
								eBird Location ID<br/>
								<Input type="text" name="locationId" />
								<span className="text-xs text-gray-500 font-normal">Example: L12345678</span>
							</label>
						</div>
					</div>
					<div className="px-4 py-3 bg-gray-100 text-right sm:px-6 rounded">
						<Submit color="green" className="font-medium">Continue</Submit>	
					</div>
				</div>
			</Form>
		</div>
	)
}
