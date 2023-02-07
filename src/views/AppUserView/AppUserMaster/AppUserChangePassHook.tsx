/* begin general import */
import { AxiosError } from "axios";
import { TFunction } from "i18next";
/* end general import */
/* begin individual import */
import { AppUser } from "models/AppUser";
import React, { useCallback, useState } from "react";
import { appUserRepository } from "repositories/app-user-repository";
import appMessageService from "services/app-message-service";
import { Drawer, FormItem, InputText } from "react3l-ui-library";
import { useTranslation } from "react-i18next";
import { Col, Row } from "antd";
import "./AppUserChangePassHook.scss";
/* end individual import */

export function useAppUserChangePassHook(setLoadList: () => void): {
  pass: string;
  cfPass: string;
  errorVisible: boolean;
  errorName: string;
  visibleChangePass: boolean;
  appUser: AppUser;
  handleChangePass: (event: any) => void;
  handleChangeConfirmPass: (event: any) => void;
  handleCloseChangePassView: () => void;
  handleSaveNewPass: (pass: string, cfpass: string) => void;
  handleOpenchangePassView: (id: number) => void;
} {
  const [translate] = useTranslation();
  const [appUser, setAppUser] = useState<AppUser>(new AppUser());
  const [visibleChangePass, setVisibleChangePass] = useState<boolean>(false);

  const [pass, setPass] = React.useState<string>("");
  const [cfPass, setCfPass] = React.useState<string>("");
  const [errorVisible, setErrorVisible] = React.useState<boolean>(false);
  const [errorName, setErrorName] = React.useState<string>("");

  const handleChangePass = React.useCallback(
    (event) => {
      const newPass: string = event;
      setPass(newPass);
      setErrorVisible(false);
    },
    [setPass]
  );

  const handleChangeConfirmPass = React.useCallback(
    (event) => {
      const newPass: string = event;
      setCfPass(newPass);
      setErrorVisible(false);
    },
    [setCfPass]
  );

  const handleOpenchangePassView = useCallback((id: number) => {
    appUserRepository.get(id).subscribe((user) => {
      setAppUser(user);
      setVisibleChangePass(true);
      setPass("");
      setCfPass("");
    });
  }, []);
  const handleCloseChangePassView = React.useCallback(() => {
    setVisibleChangePass(false);
  }, []);

  const { notifyUpdateItemSuccess } = appMessageService.useCRUDMessage();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handleSaveNewPass = useCallback(
    (pass, cfPass) => {
      if (pass === "") {
        setErrorVisible(true);
        setErrorName(translate("appUsers.changePassword.notHavePassword"));
      } else if (cfPass === "") {
        setErrorVisible(true);
        setErrorName(translate("appUsers.changePassword.notHaveREPassword"));
      } else if (pass !== cfPass) {
        setErrorVisible(true);
        setErrorName(translate("appUsers.changePassword.passWordNotSame"));
      } else if (pass === cfPass) {
        appUser.newPassword = pass;
        setAppUser(appUser);
        appUserRepository.changePassword(appUser).subscribe(
          (item: AppUser) => {
            setAppUser({ ...item });
            setTimeout(() => {
              notifyUpdateItemSuccess();
            }, 0);
            setVisibleChangePass(false);
            setLoadList();
          },
          (error: AxiosError<AppUser>) => {
            if (error.response && error.response.status === 400) {
              setAppUser(error.response?.data);
            }
          }
        );
      }
    },
    [appUser, notifyUpdateItemSuccess, setLoadList, translate]
  );
  return {
    pass,
    cfPass,
    errorVisible,
    errorName,
    visibleChangePass,
    appUser,
    handleChangePass,
    handleChangeConfirmPass,
    handleCloseChangePassView,
    handleSaveNewPass,
    handleOpenchangePassView,
  };
}

interface AppUserChangePassViewProps {
  pass?: string;
  cfPass?: string;
  errorVisible?: boolean;
  errorName?: string;
  visibleChangePass?: boolean;
  handleChangePass?: (event: any) => void;
  handleChangeConfirmPass?: (event: any) => void;
  handleCloseChangePassView?: () => void;
  handleSaveNewPass?: (pass: string, cfpass: string) => void;
  handleOpenchangePassView?: (id: number) => void;
  translate?: TFunction;
}

export function AppUserChangePassView(props: AppUserChangePassViewProps) {
  const {
    pass,
    cfPass,
    errorVisible,
    errorName,
    visibleChangePass,
    handleChangePass,
    handleChangeConfirmPass,
    handleCloseChangePassView,
    handleSaveNewPass,
    translate,
  } = props;

  return (
    <>
      <Drawer
        {...props}
        loading={false}
        visible={visibleChangePass}
        handleSave={() => handleSaveNewPass(pass, cfPass)}
        handleCancel={handleCloseChangePassView}
        handleClose={handleCloseChangePassView}
        visibleFooter={true}
        title={translate("appUsers.changePassword")}
        titleButtonCancel={translate("general.actions.close")}
        titleButtonApply={translate("general.actions.save")}
      >
        <div className="page page__detail">
          <div className="w-100 page__detail-tabs">
            <Row className="d-flex">
              <Col lg={24}>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col lg={24} className="m-b--sm m-t--sm">
                    <FormItem>
                      <InputText
                        label={translate("appUsers.changePassword.newPass")}
                        type={0}
                        value={pass}
                        placeHolder={translate(
                          "appUsers.changePassword.newPass"
                        )}
                        className={"tio-account_square_outlined"}
                        onChange={handleChangePass}
                      />
                    </FormItem>
                  </Col>

                  <Col lg={24} className="m-b--sm m-t--sm">
                    <FormItem>
                      <InputText
                        label={translate("appUsers.changePassword.confirmPass")}
                        type={0}
                        value={cfPass}
                        placeHolder={translate(
                          "appUsers.changePassword.confirmNewPass"
                        )}
                        className={"tio-account_square_outlined"}
                        onChange={handleChangeConfirmPass}
                      />
                    </FormItem>
                    {errorVisible === true ? (
                      <div className="text-danger m-t--xxxs error-pass">
                        {errorName}
                      </div>
                    ) : (
                      <></>
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </div>
      </Drawer>
    </>
  );
}

export default AppUserChangePassView;
