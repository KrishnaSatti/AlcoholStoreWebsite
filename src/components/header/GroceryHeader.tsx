import IconButton from "@component/buttons/IconButton";
import GrocerySearchBox from "@component/search-box/GrocerySearchBox";
import { Tiny } from "@component/Typography";
import { useAppContext } from "@context/app/AppContext";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Box from "../Box";
import Container from "../Container";
import FlexBox from "../FlexBox";
import Icon from "../icon/Icon";
import MiniCart from "../mini-cart/MiniCart";
import Login from "../sessions/Login";
import Sidenav from "../sidenav/Sidenav";
import StyledHeader from "./HeaderStyle";
import UserLoginDialog from "./UserLoginDialog";
import axios from "axios";

type HeaderProps = {
  isFixed?: boolean;
  className?: string;
};

const GroceryHeader: React.FC<HeaderProps> = ({ className }) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const toggleSidenav = () => setOpen(!open);
  const [loggedin, setLoginState] = useState(null);
  const router = useRouter();

  const { state } = useAppContext();
  const { cartList } = state.cart;

  useEffect(() => {
    const namefunction = async () => {
      const name = await axios.get("/api/navbarName");
      console.log(name);
      if (name.data.message == "invalid token") {
        setData("Sign In");
        setLoginState(false);
      } else {
        setData(name.data.name);
        setLoginState(true);
      }
    };
    namefunction();
  }, []);

  const profileRoute = () => {
    if (loggedin == false) {
      return (
        <UserLoginDialog
          handle={
            <IconButton ml="1rem" bg="gray.200" p="8px">
              <Icon size="28px">user</Icon>
            </IconButton>
          }
        >
          <Box>
            <Login />
          </Box>
        </UserLoginDialog>
      );
    } else {
      return (
        <Link href="/profile">
          <IconButton ml="1rem" bg="gray.200" p="8px">
            <Icon size="28px">user</Icon>
          </IconButton>
        </Link>
      );
    }
  };

  const cartHandle = (
    <FlexBox ml="20px" alignItems="flex-start">
      <IconButton bg="gray.200" p="12px">
        <Icon size="20px">bag</Icon>
      </IconButton>

      {!!cartList.length && (
        <FlexBox
          borderRadius="300px"
          bg="error.main"
          px="5px"
          py="2px"
          alignItems="center"
          justifyContent="center"
          ml="-1rem"
          mt="-9px"
        >
          <Tiny color="white" fontWeight="600">
            {cartList.length}
          </Tiny>
        </FlexBox>
      )}
    </FlexBox>
  );

  return (
    <StyledHeader className={className}>
      <Container
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        height="100%"
      >
        <FlexBox className="logo" alignItems="center" mr="1rem">
          <Link href="/">
            <a>
              <img src="/assets/images/logo.svg" alt="logo" />
            </a>
          </Link>
        </FlexBox>

        <FlexBox justifyContent="center" flex="1 1 0">
          <GrocerySearchBox />
        </FlexBox>

        <FlexBox className="header-right" alignItems="center">
          {data}
          {profileRoute()}

          <Sidenav
            handle={cartHandle}
            position="right"
            open={open}
            width={380}
            toggleSidenav={toggleSidenav}
          >
            <MiniCart toggleSidenav={toggleSidenav} />
          </Sidenav>
        </FlexBox>
      </Container>
    </StyledHeader>
  );
};

export default GroceryHeader;
