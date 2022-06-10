import { useRouter } from "next/router";
import useFirebaseLogin from "hooks/useFirebaseLogin";
import type { NextPage } from "next";
import Input from "components/Input";
import AuthError from "components/AuthError";
import Submit from "components/Submit";
import { useForm, SubmitHandler } from "react-hook-form";
import Form from "components/Form";
import FormError from "components/FormError";
import UtilityPage from "components/UtilityPage";

type Inputs = {
	email: string,
	password: string,
};

const Login: NextPage = () => {
	const { login, loading, error } = useFirebaseLogin();
	const form = useForm<Inputs>();
	const router = useRouter();

	const handleSubmit: SubmitHandler<Inputs> = async ({email, password}) => {
		const success = await login(email, password);
		if (success) router.push("/");
	}

	return (
		<UtilityPage heading="Editor Login">
			<Form onSubmit={handleSubmit} form={form}>
				<div className="mb-4">
					<label className="text-gray-600">
						Email<br/>
						<Input type="email" name="email" required/>
					</label>
					<FormError name="email"/>
				</div>
				<div className="mb-4">
					<label className="text-gray-600">
						Password<br/>
						<Input type="password" name="password" required/>
					</label>
					<FormError name="password"/>
				</div>
				{error && <AuthError>Error logging in</AuthError>}
				<p className="text-center mt-8">
					<Submit loading={loading} color="green">Login</Submit>
				</p>
			</Form>
		</UtilityPage>
	);
}

export default Login;