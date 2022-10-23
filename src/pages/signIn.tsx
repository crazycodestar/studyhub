import { NextPage } from "next";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Formik, Form, Field } from "formik";
import signInValidation, {
  signInValidationType,
} from "../validation/signInValidation";

const SignIn: NextPage = () => {
  const [email, setEmail] = useState<null | string>(null);

  return (
    <div className="flex h-screen items-center justify-center">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={(values: signInValidationType) => {
          signIn("email", { email: values.email });
        }}
      >
        {({ values }) => (
          <div className="w-1/2 ">
            <Form>
              <div className="flex flex-col space-y-4 rounded-md p-4 shadow-md">
                <p>signin</p>
                <Field
                  type="text"
                  name="email"
                  placeholder="username or email address"
                  className="rounded-md p-2"
                />
                {/* <input
                  name="email"
                  type="text"
                  placeholder="username or email address"
                  className="rounded-md p-2"
                /> */}
                <input
                  type="text"
                  placeholder="Passwowrd"
                  className="rounded-md  p-2"
                />

                <pre>{JSON.stringify(values, null, 2)}</pre>
                <button
                  type="submit"
                  className="rounded-md bg-pink-700 p-2 text-white"
                >
                  Signin
                </button>

                {/* <button className="rounded-md bg-pink-700 p-2 text-white">
                  Signin
                </button> */}
                <button
                  onClick={() => signIn("email")}
                  className="rounded-md bg-pink-700 p-2 text-white"
                >
                  Sign In with discord
                </button>
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default SignIn;
