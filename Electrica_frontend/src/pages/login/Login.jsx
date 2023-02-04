import { data } from "autoprefixer";
import { useState, useContext, useEffect, useRef } from "react";
import Logo from "../../../public/assets/logo.png";
import { Context } from "../../context/Context";
import { asignarDataLogin, dataLogin } from "../../services/datosUsuario";
import ReCAPTCHA from "react-google-recaptcha";

function Login() {
  //Una variable por acá para saber si se encuentra en esta página, así mismo se pasa a al data del email validation.

  const context = useContext(Context);
  // console.log(example.loginState);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [userInit, setInit] = useState("");
  const [captchaValido, setCaptcha] = useState(null);
  const captcha = useRef(null);
  

  //Esto es para cuando se refresca la página no perder la sesión iniciada.
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loginUser");
    if (loggedUserJSON && JSON.parse(loggedUserJSON).error != true) {
      const user = JSON.parse(loggedUserJSON);
      asignarDataLogin(user);
      let data = {
        stateLogin: false,
        name: dataLogin.name,
        roll: null,
      };
      context.setAppState(data);
    }
  }, []);

  //Este el action del captcha.
  const onRecaptcha = () => {
    if(captcha.current.getValue()){
      setCaptcha(true)
    }
  };

  //Este bloque se encarga de pedir el token a la bd, y hacer modificaciones del usuario.
  //----------------------------------------------------------------------------
  const consultaUsuarioBD = async (config) => {
    const data = await fetch("http://127.0.0.1:8000/core/user/token", config);
    return data.json();
  };

  const login = async (e) => {
    e.preventDefault();
    if(captcha.current.getValue() == ""){
      setCaptcha(false)
    }
    else{
      setCaptcha(true)
      const config = {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username: user, password: password }),
      };
      const response = await consultaUsuarioBD(config);
      //console.log("resp", response)
      asignarDataLogin(response);
      emailValidation();
  
      window.localStorage.setItem("loginUser", JSON.stringify(dataLogin));
    }

    
  };

  const emailValidation = () => {
    const regEx = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g;
    //console.log("emailValidation", dataLogin.error)
    //console.log("Validación", dataLogin.error != true)
    if (dataLogin.error != false) {
      alert("Datos erróneos o incompletos, verifique o intente nuevamente");
    } else if (regEx.test(user)) {
      setInit(
        JSON.stringify({
          nameUser: user,
          namePassword: password,
        })
      );
      let data = {
        stateLogin: false,
        name: dataLogin.name,
        roll: null,
      };
      //client, admin, operator, manager -> Esto debe de obtenerse desde la data que se trae.

      context.setAppState(data);
      // setLoginActivated(!loginActivated);
      // console.log(loginState);
    } else if (!regEx.test(user) && user !== "") {
      alert("Direccion de Correo invalida");
    } else {
      alert("Malo");
    }
  };
  //-----------------------------------------------------------------------------
  // console.log(userInit);
  // console.log("login is" + loginActivated)


  return (
    // <AppContext.Provider value={loginActivated}>
    <div className="min-h-screen bg-[#F2F4FE] flex items-center justify-center p-4">
      <div className="max-w-lg">
        <div className="flex justify-center mb-8">
          <img src={Logo} width="100" height="100" />
        </div>
        <div className="bg-white w-full rounded-lg p-8 mb-8">
          <div className="flex flex-col items-center gap-1 mb-8">
            <h1 className="text-xl text-gray-900">Bienvenido</h1>
            <p className="text-gray-400 text-sm">
              Ingresa con tu correo electrónico y tu contraseña
            </p>
          </div>
          <form className="flex flex-col gap-4">
            <div className="relative">
              <input
                type="email"
                id="user"
                className="w-full border py-2 px-10 rounded-md outline-none"
                placeholder="Ingresa tu correo"
                onChange={(e) => setUser(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 absolute left-2 top-[50%] -translate-y-[50%] text-blue-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </div>
            <div className="relative">
              <input
                type="password"
                id="password"
                className="w-full border py-2 px-10 rounded-md outline-none"
                placeholder="Ingresa tu contraseña"
                onChange={(e) => setPassword(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 absolute left-2 top-[50%] -translate-y-[50%] text-blue-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </div>
            <div className="recaptcha">
              {/*El sitekey debe de cambiar cuando se monte en servidor, pues por ahora solo está para que funcione en localhost */}
              <ReCAPTCHA
                ref={captcha}
                sitekey="6LcsHvIjAAAAALpEmAD29qNBTczlQsK-4hdRGOoh"
                // sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                onChange={onRecaptcha}
              />
            </div>
            {captchaValido === false && <div className="text-xs text-red-600 px-12">Acepte el captcha antes de continuar</div>}
            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 py-2 px-4 text-white rounded-md hover:bg-blue-600 transition-colors"
                onClick={login}
              >
                Iniciar sesión
              </button>
            </div>
          </form>
        </div>
        <span className="flex items-center justify-center gap-2">
          ¿Olvidaste tu contraseña?{" "}
          <a href="#" className="text-blue-500">
            Recuperar
          </a>
        </span>
      </div>
    </div>
    // </AppContext.Provider>
  );
}

export default Login;
