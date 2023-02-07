import { AxiosError } from "axios";
import { AppUser } from "models/AppUser";
import React, { useCallback, useEffect, useState } from "react";
import { setGlobal } from "reactn";
import authenticationService from "services/authentication-service";
import { getParameterByName } from "helpers/query";
import { LANDING_PAGE_ROUTE } from "config/route-consts";
import { GlobalState } from "config/global";
import jwt_decode from "jwt-decode";
export default function useLogin(
  appUser: any,
  setAppUser: any,
  setErrorMessageUsername: any,
  setErrorMessagePass: any,
  setErrorMessageOtp: any,
  setErrorMessageEmail: any
): [
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  string,
  () => void,
  (event: any) => void,
  (event: any) => void,
  () => void,
  () => void,
  (event: any) => void,
  (event: any) => void,
  () => void,
  () => void,
  () => void,
  (field: string) => (ev: any) => void,
  (ev: React.KeyboardEvent<HTMLInputElement>) => void,
  string,
  string,
  string,
  boolean,
  () => void
] {
  const [loginVisible, setLoginVisible] = useState(true);
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [getOtpVisible, setGetOtpVisible] = useState(false);
  const [changePassVisible, setChangePassVisible] = useState(false);
  const [successViewVisible, setSuccessViewVisible] = useState(false);
  const [email, setEmail] = useState<string>(null);
  const [otp, setOtp] = useState<string>(null);
  const [newPass, setNewPass] = useState<string>(null);
  const [confirmPass, setConfirmPass] = useState<string>(null);
  const [checkPass, setCheckPass] = useState<boolean>(false);

  const showForgotPassword = () => {
    setLoginVisible(false);
    setForgotPasswordVisible(true);
  };
  const showLogin = () => {
    setLoginVisible(true);
    setForgotPasswordVisible(false);
    setChangePassVisible(false);
    setGetOtpVisible(false);
    setOtp(null);
    setEmail(null);
    setNewPass(null);
    setConfirmPass(null);
    setErrorMessageUsername(null);
    setErrorMessagePass(null);
    setErrorMessageOtp(null);
    setErrorMessageEmail(null);
  };
  const handleLogin = useCallback(() => {
    authenticationService.login(appUser).subscribe(
      (user: AppUser) => {
        setGlobal<GlobalState>({
          user,
        });
        localStorage.setItem("currentUserInfo", JSON.stringify(user));
        const redirect =
          getParameterByName("redirect") === null
            ? LANDING_PAGE_ROUTE
            : getParameterByName("redirect");
        window.location.href = `${redirect}`;
      },
      (error) => {
        if (error.response && error.response.status === 400) {
          const { username, password } = error.response.data?.errors;
          if (typeof username !== "undefined")
            setErrorMessageUsername(username);
          if (typeof password !== "undefined") setErrorMessagePass(password);
        }
      }
    );
  }, [appUser, setErrorMessagePass, setErrorMessageUsername]);

  /*start handle login by google*/
  const handleCredentialResponse = useCallback(
    (response) => {
      const googleUser: { email: string } = jwt_decode(response.credential);

      authenticationService
        .login({ username: googleUser.email, idToken: response.credential })
        .subscribe(
          (user: AppUser) => {
            setGlobal<GlobalState>({
              user,
            });
            localStorage.setItem("currentUserInfo", JSON.stringify(user));
            const redirect =
              getParameterByName("redirect") === null
                ? LANDING_PAGE_ROUTE
                : getParameterByName("redirect");
            window.location.href = `${redirect}`;
          },
          (error) => {
            if (error.response && error.response.status === 400) {
              const { username, password } = error.response.data?.errors;
              if (typeof username !== "undefined")
                setErrorMessageUsername(username);
              if (typeof password !== "undefined")
                setErrorMessagePass(password);
            }
          }
        );

      // authenticationService.loginByGmail(response.credential).subscribe(
      //   (user: AppUser) => {
      //     setGlobal<GlobalState>({
      //       user,
      //     });
      //     localStorage.setItem("currentUserInfo", JSON.stringify(user));
      //     const redirect =
      //       getParameterByName("redirect") === null
      //         ? LANDING_PAGE_ROUTE
      //         : getParameterByName("redirect");
      //     window.location.href = `${redirect}`;
      //   },
      //   (error) => {
      //     if (error.response && error.response.status === 400) {
      //       const { username, password } = error.response.data?.errors;
      //       if (typeof username !== "undefined")
      //         setErrorMessageUsername(username);
      //       if (typeof password !== "undefined") setErrorMessagePass(password);
      //     }
      //   }
      // );
    },
    [setErrorMessagePass, setErrorMessageUsername]
  );
  useEffect(() => {
    google.accounts.id.initialize({
      client_id:
        "1050901341780-nvn6fm54fgm57ihkr75du9h16uh9426q.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });
    google.accounts.id.renderButton(
      document.getElementById("google-login-div"),
      {
        theme: "outline",
        size: "small",
        type: "standard",
        shape: "rectangular",
        width: "368",
      } // customization attributes
    );
  }, [handleCredentialResponse]);

  // function này bỏ
  const handleClickLoginByGoogle = useCallback(() => {
    const loginDiv = document
      .getElementById("google-login-div")
      .querySelector("iframe");
    const iframeLoginDiv =
      loginDiv.contentWindow.document.querySelector("span");
    iframeLoginDiv.click();
  }, []);
  /** end handle login by gmail */
  // handle change email
  const handleChangeEmail = useCallback((event) => {
    setEmail(event);
  }, []);

  // handle change otp
  const handleChangeOtp = useCallback(
    (event) => {
      setOtp(event);
      setErrorMessageOtp(null);
    },
    [setErrorMessageOtp]
  );

  // SendOtp

  const handleSendOtp = useCallback(() => {
    const obj = {
      email,
      otpCode: otp,
    };
    authenticationService.verifyOtpCode(obj).subscribe(
      () => {
        setGetOtpVisible(false);
        setChangePassVisible(true);
      },
      (error: AxiosError<AppUser>) => {
        if (error.response && error.response.status === 400) {
          const { otpCode } = error.response.data?.errors;
          if (typeof otpCode !== "undefined") setErrorMessageOtp(otpCode);
        }
        setChangePassVisible(false);
      }
    );
  }, [email, otp, setErrorMessageOtp]);

  // Send mail to get otp
  const handleSendMail = useCallback(() => {
    authenticationService.forgotPassword(email).subscribe(
      () => {
        setForgotPasswordVisible(false);
        setGetOtpVisible(true);
      },
      (error) => {
        if (error.response && error.response.status === 400) {
          setErrorMessageEmail(error.response.data?.errors?.email);
        }
      }
    );
  }, [email, setErrorMessageEmail]);

  // Get new pass word
  const handleChangeNewPass = useCallback((event) => {
    setNewPass(event);
    setCheckPass(false);
  }, []);

  const handleChangeConfirmPassword = useCallback(
    (event) => {
      const confirmPass: string = event;
      setConfirmPass(event);
      if (confirmPass === newPass) {
        setCheckPass(true);
      } else {
        setCheckPass(false);
      }
    },
    [newPass]
  );

  const handleChangePass = useCallback(() => {
    authenticationService
      .recoveryPassword(confirmPass)
      .pipe()
      .subscribe(() => {
        setSuccessViewVisible(true);
        setChangePassVisible(false);
        setGetOtpVisible(false);
        setTimeout(() => {
          setSuccessViewVisible(false);
          setLoginVisible(true);
        }, 1000);
      });
  }, [confirmPass]);
  /* return handleChangePass, handleChangeNewPass, handleChangeConfirmPassword, handleChangeEmail, handleSendMail */

  const handleSetValue = useCallback(
    (field: string, value?: string | number | boolean | null) => {
      setAppUser({
        ...appUser,
        [field]: value,
        errors: undefined,
      });
      setErrorMessagePass(null);
      setErrorMessageUsername(null);
    },
    [appUser, setAppUser, setErrorMessagePass, setErrorMessageUsername]
  );

  const handleChangeField = useCallback(
    (field: string) => {
      return (value: string) => {
        return handleSetValue(field, value);
      };
    },
    [handleSetValue]
  );
  const handleEnter = useCallback(
    (ev: React.KeyboardEvent<HTMLInputElement>) => {
      if (ev.key === "Enter") {
        handleLogin();
      }
    },
    [handleLogin]
  );
  return [
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
    handleClickLoginByGoogle,
  ];
}
