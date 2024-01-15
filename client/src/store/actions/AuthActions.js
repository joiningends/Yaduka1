import {
  formatError,
  login,
  login1,
  otpf,
  addUser,
  addUser1,
  addUser2,
  _editUser,
  _editUser1,
  _editUser2,
  _addSubscription,
  _editSubscription,
  changePassword,
  runLogoutTimer,
  saveTokenInLocalStorage,
  signUp,
} from "../../services/AuthService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const SIGNUP_CONFIRMED_ACTION = "[signup action] confirmed signup";
export const SIGNUP_FAILED_ACTION = "[signup action] failed signup";
export const LOGIN_CONFIRMED_ACTION = "[login action] confirmed login";
export const LOGIN_FAILED_ACTION = "[login action] failed login";
export const LOADING_TOGGLE_ACTION = "[Loading action] toggle loading";
export const LOGOUT_ACTION = "[Logout action] logout action";

export function signupAction(email, password, history) {
  return (dispatch) => {
    signUp(email, password)
      .then((response) => {
        saveTokenInLocalStorage(response.data);
        runLogoutTimer(dispatch, response.data.expiresIn * 1000, history);
        dispatch(confirmedSignupAction(response.data));
        history.push("/dashboard");
      })
      .catch((error) => {
        const errorMessage = formatError(error.response.data);
        dispatch(signupFailedAction(errorMessage));
      });
  };
}

export function logout(history) {
  localStorage.removeItem("userDetails");
  history.push("/login");
  return {
    type: LOGOUT_ACTION,
  };
}

export function loginAction(userName, password, history) {
  return (dispatch) => {
    console.log("helo1");
    login(userName, password)
      .then((response) => {
        console.log("user Data", response.data);
        let res = response.data;
        let token = res.token;
        let user_id = res.loggedInUserID;
        localStorage.setItem("USERID", user_id);
        let user_name = res.loggedInUserName;
        localStorage.setItem("USERNAME", user_name);
        let user_type = res.roles;
        localStorage.setItem("USERTYPE", user_type);
        let isAdmin = res.isAdmin;
        localStorage.setItem("ISADMIN", isAdmin);
        let roleId = res.roleId;
        localStorage.setItem("ROLEID", roleId);
        let roleName = res.roleName;
        localStorage.setItem("ROLENAME", roleName);
        localStorage.setItem("MYTOKEN", token);
        saveTokenInLocalStorage(response.data);
        runLogoutTimer(dispatch, history);

        dispatch(loginConfirmedAction(response.data));
        console.log("my data");
        toast.success("Welcome to Yaduka " + res.loggedInUserName);

        if (user_type == "SuperAdministrator") {
          history.push("/dashboard");
        } else {
          history.push("/dashboard");
        }
        /* if(user_type=="Supervisor") {
                        history.push('/supervisor-dashboard'); 
                    }
                    if(user_type=="Advisor") {
                        history.push('/advisor-dashboard'); 
                    }
                    if(user_type=="Customer") {
                        history.push('/customer-dashboard'); 
                    } */
      })
      .catch((error) => {
        //console.log(error);
        console.log("Hello");
        toast.error("Invalid Password!");
        /* const errorMessage = formatError(error.response.data);
                    dispatch(loginFailedAction(errorMessage)); */
      });
  };
}

export function loginAction1(mobileNumber, otp, history) {
  return (dispatch) => {
    login1(mobileNumber, otp)
      .then((response) => {
        if (response.data.author.terminate === true) {
          toast.error("User is terminated by super admin")
        } else {
          let res = response.data.author;
          toast.info(
            "OTP has been send to your register mobile no " + res.mobileNumber
          );
          console.log(response.data.author);
          sessionStorage.setItem("otp", otp);
          sessionStorage.setItem("pwdverify", res.pwdverify);
          sessionStorage.setItem("userName", res.mobileNumber);
          sessionStorage.setItem("myId", res.id);
          sessionStorage.setItem("password", res.passwords);

          history.push("/otp");
        }
      })
      .catch((error) => {
        toast.error("This mobile no does not exist");
      });
  };
}

export function changePwd(myId, password, history) {
  return (dispatch) => {
    console.log(myId, +" " + password);
    changePassword(myId, password)
      .then((response) => {
        let res = response.data.result;
        console.log(res);
        sessionStorage.setItem("password", res.passwords);
        history.push("/password");
      })
      .catch((error) => {
        toast.warning(error.message);
      });
  };
}

export function _addUser(email, phoneNumber, name, accountId, history) {
  return (dispatch) => {
    addUser(email, phoneNumber, name, accountId)
      .then((response) => {
        toast.success(
          "Created, A verification link has been to given mail address"
        );
        history.push("/user-list");
      })
      .catch((error) => {
        toast.warning("Mobile number or email address already exist");
        /* const errorMessage = formatError(error.response.data);
                dispatch(loginFailedAction(errorMessage)); */
      });
  };
}

export function editUser(
  id,
  email,
  phoneNumber,
  name,
  accountId,
  myParentId,
  history
) {
  return (dispatch) => {
    _editUser(id, email, phoneNumber, name, accountId, myParentId)
      .then((response) => {
        toast.success("Successfully Updated");
        //history.push('/user-list');
      })
      .catch((error) => {
        toast.warning("Something Went Wrong");
        /* const errorMessage = formatError(error.response.data);
                dispatch(loginFailedAction(errorMessage)); */
      });
  };
}

export function editSubscription(id, title, day, amount, history) {
  return (dispatch) => {
    _editSubscription(id, title, day, amount)
      .then((response) => {
        toast.success("Successfully Updated");
        history.push("/subscription-list");
      })
      .catch((error) => {
        toast.warning("Something Went Wrong");
        /* const errorMessage = formatError(error.response.data);
                dispatch(loginFailedAction(errorMessage)); */
      });
  };
}

export function editUser1(
  id,
  address,
  dob,
  pan,
  stateId,
  cityId,
  postalCode,
  link,
  history
) {
  return (dispatch) => {
    _editUser1(id, address, dob, pan, stateId, cityId, postalCode, link)
      .then((response) => {
        toast.success("Successfully Updated");
        //history.push('/user-list');
      })
      .catch((error) => {
        toast.warning("Something Went Wrong");
        /* const errorMessage = formatError(error.response.data);
                dispatch(loginFailedAction(errorMessage)); */
      });
  };
}

export function editUser2(
  id,
  stockBroker,
  loginId,
  mypassword,
  totpKey,
  mypan,
  apiKey,
  history
) {
  return (dispatch) => {
    _editUser2(id, stockBroker, loginId, mypassword, totpKey, mypan, apiKey)
      .then((response) => {
        toast.success("Successfully Updated");
        //history.push('/user-list');
      })
      .catch((error) => {
        toast.warning("Something Went Wrong");
        /* const errorMessage = formatError(error.response.data);
                dispatch(loginFailedAction(errorMessage)); */
      });
  };
}

export function _addUser1(email, phoneNumber, name, myParentId, history) {
  return (dispatch) => {
    addUser1(email, phoneNumber, name, myParentId)
      .then((response) => {
        toast.success(
          "Created, A verification link has been to given mail address"
        );
        let userType = localStorage.getItem("USERTYPE");
        if (userType == "SuperAdministrator") {
          history.push("/user-list");
        } else if (userType == "Supervisor") {
          history.push("/super-user-list");
        } else {
          history.push("/advisor-user-list");
        }
      })
      .catch((error) => {
        toast.warning("Mobile number or email address already exist");
        /* const errorMessage = formatError(error.response.data);
                dispatch(loginFailedAction(errorMessage)); */
      });
  };
}

export function _addUser2(email, phoneNumber, name, myParentId, history) {
  return (dispatch) => {
    addUser2(email, phoneNumber, name, myParentId)
      .then((response) => {
        toast.success(
          "Created, A verification link has been to given mail address"
        );
        let userType = "SuperAdministrator"; //localStorage.getItem("USERTYPE");
        if (userType == "SuperAdministrator") {
          history.push("/user-list");
        } else if (userType == "Supervisor") {
          history.push("/super-user-list");
        } else {
          history.push("/advisor-user-list");
        }
      })
      .catch((error) => {
        toast.warning("Mobile number or email address already exist");
        /* const errorMessage = formatError(error.response.data);
                dispatch(loginFailedAction(errorMessage)); */
      });
  };
}

export function addSubscription(title, day, amount, history) {
  return (dispatch) => {
    _addSubscription(title, day, amount)
      .then((response) => {
        toast.success("Created, A Subscription has been added");
        history.push("/subscription-list");
      })
      .catch((error) => {
        toast.warning("Something went wrong!");
      });
  };
}

export function loginAction2(otp, history) {
  return (dispatch) => {
    let myotp = sessionStorage.getItem("otp");

    console.log(myotp);
    console.log(otp);

    if (myotp == otp) {
      let pwdverify = sessionStorage.getItem("pwdverify");
      console.log(pwdverify);
      if (pwdverify == "false") {
        history.push("/reset-password");
      } else {
        history.push("/password");
      }
    } else {
      toast.error("Wrong OTP");
    }
  };
}

export function loginFailedAction(data) {
  return {
    type: LOGIN_FAILED_ACTION,
    payload: data,
  };
}

export function loginConfirmedAction(data) {
  return {
    type: LOGIN_CONFIRMED_ACTION,
    payload: data,
  };
}

export function confirmedSignupAction(payload) {
  return {
    type: SIGNUP_CONFIRMED_ACTION,
    payload,
  };
}

export function signupFailedAction(message) {
  return {
    type: SIGNUP_FAILED_ACTION,
    payload: message,
  };
}

export function loadingToggleAction(status) {
  return {
    type: LOADING_TOGGLE_ACTION,
    payload: status,
  };
}
