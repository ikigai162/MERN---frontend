import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuth, fetchRegister } from "../../redux/slices/auth";
import { Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import styles from "./Login.module.scss";

export const Registration = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    //Atunci cand cele doua campuri vor fi validate (password si email) ele vor fi transmise in useForm car intoarce formState cu eroare sau validare
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
    mode: "onChange", //Ele vor fi validate in cazul in care se vor introduce schimbari
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegister(values)); // Transmite datele de înregistrare (values) către fetchRegister
    console.log(data.payload);

    if (!data.payload) {
      return alert("Nu s-a reusit inregistrarea!");
    }

    if ("token" in data.payload) {
      window.localStorage.setItem("token", data.payload.token);
    } else {
      alert("Nu s-a reusit inregistrarea!");
    }
  };

  if (isAuth) {
    return <Navigate to="/" />; //Dupa ce a reusit autentificarea utilizatorul va trece pe pagina principala
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message} //Daca nu va afi introdusa sau va fi introdusa gresit posta va aparea eroare
          {...register("fullName", { required: "Introduceti numele" })}
          className={styles.field}
          label="Полное имя"
          fullWidth
        />
        <TextField
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message} //Daca nu va afi introdusa sau va fi introdusa gresit posta va aparea eroare
          {...register("email", { required: "Introduceti adresa de email" })}
          type="email"
          className={styles.field}
          label="E-Mail"
          fullWidth
        />
        <TextField
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message} //Daca nu va afi introdusa sau va fi introdusa gresit posta va aparea eroare
          {...register("password", { required: "Introduceti parola" })}
          type="password"
          className={styles.field}
          label="Пароль"
          fullWidth
        />
        <Button
          disabled={!isValid}
          type="submit"
          size="large"
          variant="contained"
          fullWidth
        >
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};
