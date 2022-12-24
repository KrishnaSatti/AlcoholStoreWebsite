import React from "react";
import FlexBox from "../components/FlexBox";
import Verify from "../components/sessions/Verify";

import { useRouter } from "next/router";

const SignUpPage = () => {
  const router = useRouter();
  const {
    query: { username, password, name },
  } = router;
  console.log(password);

  return (
    <FlexBox
      flexDirection="column"
      minHeight="100vh"
      alignItems="center"
      justifyContent="center"
    >
      {password}
      <Verify />
    </FlexBox>
  );
};

export default SignUpPage;
