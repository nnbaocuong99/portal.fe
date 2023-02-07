import { Checkbox, Divider } from "antd";
import { AppUser } from "models/AppUser";
import React, { useState } from "react";
import nameof from "ts-nameof.macro";
import "./Login.scss";
import useLogin from "./LoginService";
import ChangePassword from "./ChangePassword";
import ForgotPassword from "./ForgotPassword";
import GetOtp from "./GetOtp";
import LoginHeader from "./LoginHeader";
import { Loop32, UserAvatar16, View16, Login16 } from "@carbon/icons-react";
import { FormItem, Button } from "react3l-ui-library";
import InputTextLogin from "./InputTextLogin/InputTextLogin";
import SuccessResultView from "./SuccessResultView";
import { useTranslation } from "react-i18next";

function Login() {
  const [appUser, setAppUser] = useState<AppUser>({
    ...new AppUser(),
    username: "",
    password: "",
  });
  const [errorMessageUsername, setErrorMessageUsername] =
    useState<string>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [errorMessagePass, setErrorMessagePass] = useState<string>(null);
  const [errorMessageOtp, setErrorMessageOtp] = useState<string>(null);
  const [errorMessageEmail, setErrorMessageEmail] =
    React.useState<string>(null);
  const [translate] = useTranslation();

  const [
    loginVisible,
    forgotPasswordVisible,
    getOtpVisible,
    changePassVisible,
    checkPass,
    confirmPass,
    showForgotPassword,
    handleChangeEmail,
    handleChangeOtp,
    handleSendOtp,
    handleSendMail,
    handleChangeNewPass,
    handleChangeConfirmPassword,
    handleChangePass,
    showLogin,
    handleLogin,
    handleChangeField,
    handleEnter,
    otp,
    email,
    newPass,
    successViewVisible,
  ] = useLogin(
    appUser,
    setAppUser,
    setErrorMessageUsername,
    setErrorMessagePass,
    setErrorMessageOtp,
    setErrorMessageEmail
  );

  return (
    <>
      <div className="login-page">
        <LoginHeader />

        <div className="login-page__content d-flex align-items-start m-l--xxl">
          <div className="main-content-form">
            {loginVisible === true && (
              <div>
                <div className="login-page__content--logo">
                  <div>
                    <Loop32 color={"#fff"} className="login-page--icon" />
                  </div>
                </div>
                <h2 className="login-page__content--title">
                  {translate("login.loginPage.title")}
                </h2>

                <Divider className="login-page__content--divider" />

                <div className="login-page__content--form">
                  <div className="login-page__username m-b--sm">
                    <FormItem message={errorMessageUsername}>
                      <InputTextLogin
                        inputType="text"
                        label={translate("login.loginPage.username")}
                        suffix={<UserAvatar16 />}
                        value={appUser.username}
                        onChange={handleChangeField(nameof(appUser.username))}
                        placeHolder={translate(
                          "login.loginPage.placeholder.username"
                        )}
                        action={{
                          name: translate(
                            "login.loginPage.forgetPasswordButton"
                          ),
                          action: () => showForgotPassword(),
                        }}
                        onKeyDown={handleEnter}
                      />
                    </FormItem>
                  </div>
                  <div className="login-page__password m-b--sm">
                    <FormItem message={errorMessagePass}>
                      <InputTextLogin
                        inputType="password"
                        label={translate("login.loginPage.password")}
                        suffix={<View16 />}
                        value={appUser.password}
                        onChange={handleChangeField(nameof(appUser.password))}
                        placeHolder={translate(
                          "login.loginPage.placeholder.password"
                        )}
                        onKeyDown={handleEnter}
                      />
                    </FormItem>
                  </div>

                  <div className="login-page__button-wrapper m-b--lg">
                    <Button
                      icon={<Login16 />}
                      className="login-button btn--lg"
                      onClick={handleLogin}
                      disabled={
                        errorMessagePass !== null ||
                        errorMessageUsername !== null
                      }
                    >
                      {translate("login.loginPage.loginButtonLabel")}
                    </Button>
                  </div>

                  <div className="remember-password pointer m-b--max">
                    <Checkbox>
                      <span className="remember-password_label">
                        {translate("login.loginPage.rememberPasswordLabel")}
                      </span>
                    </Checkbox>
                  </div>

                  <Divider className="login-page__content--divider" />

                  <div className="m-y--sm another-login">
                    {translate("login.loginPage.anotherLoginTitle")}
                  </div>

                  <div
                    className="login-page__button-wrapper m-b--lg"
                    style={{ position: "relative" }}
                  >
                    <Button
                      type="outline-primary"
                      icon={
                        <img
                          src={require("assets/images/Google.svg").default}
                          alt=""
                        />
                      }
                      className="login-button btn--lg login-button--outline"
                    >
                      {translate("login.loginPage.loginByGoogleButtonLabel")}
                    </Button>
                    <div
                      id="google-login-div"
                      style={{
                        position: "absolute",
                        top: "0px",
                        width: "100%",
                        opacity: "0",
                      }}
                    ></div>
                  </div>

                  <div className="login-page__button-wrapper m-b--max">
                    <Button
                      type="outline-primary"
                      icon={
                        <img
                          src={require("assets/images/Azure.svg").default}
                          alt=""
                        />
                      }
                      className="login-button btn--lg login-button--outline"
                    >
                      {translate("login.loginPage.loginByADFSButtonLabel")}
                    </Button>
                  </div>

                  <Divider className="login-page__content--divider" />

                  <div
                    style={{
                      color: "#fff",
                      textAlign: "left",
                      paddingBottom: "60px",
                    }}
                    className="contact-admin"
                  >
                    {" "}
                    {translate("login.loginPage.needSupport")}{" "}
                    <span style={{ color: "var(--palette-blue-40)" }}>
                      {translate("login.loginPage.contactAdmin")}
                    </span>
                  </div>
                </div>
              </div>
            )}
            {forgotPasswordVisible && (
              <ForgotPassword
                onChangeEmail={handleChangeEmail}
                onSendMail={handleSendMail}
                showLogin={showLogin}
                errorMessageEmail={errorMessageEmail}
                email={email}
                translate={translate}
              />
            )}

            {getOtpVisible && (
              <GetOtp
                onChangeOtp={handleChangeOtp}
                onSendMail={handleSendMail}
                onSendOtp={handleSendOtp}
                otp={otp}
                showLogin={showLogin}
                errorMessageOtp={errorMessageOtp}
                translate={translate}
              />
            )}
            {changePassVisible && (
              <ChangePassword
                onChangeNewPass={handleChangeNewPass}
                onChangeConfirmPassword={handleChangeConfirmPassword}
                onChangePass={handleChangePass}
                checkPass={checkPass}
                confirmPass={confirmPass}
                showLogin={showLogin}
                newPass={newPass}
                translate={translate}
              />
            )}
            {successViewVisible && <SuccessResultView translate={translate} />}
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
