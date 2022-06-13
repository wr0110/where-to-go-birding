import Input from "components/Input";
import FormError from "components/FormError";

const AddressInput = () => {
	return (
		<div>
			<label className="text-gray-500 font-bold">
				Address<br/>
				<Input type="text" name="address.street" placeholder="Street" />
			</label>
			<div className="grid grid-cols-3 gap-4 mt-2">
				<div>
					<Input type="text" name="address.city" placeholder="City" required />
					<FormError name="address.city" />
				</div>
				<div>
					<Input type="text" name="address.state" placeholder="State" required />
					<FormError name="address.state" />
				</div>
				<div>
					<Input type="text" name="address.zip" placeholder="Zip" required />
					<FormError name="address.zip" />
				</div>
			</div>
		</div>
	)
}

export default AddressInput
