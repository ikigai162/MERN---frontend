import React from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import axios from "../../axios";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/slices/auth";

export const AddPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [text, setText] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);
  const inputFilleRef = React.useRef(null);

  const isEditing = Boolean(id);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("image", file); // Aplica la formData proprietatea image si extrage img din files din masiv
      const { data } = await axios.post("/upload", formData); //Prin axios facem request si trimitem pe server file-ul
      setImageUrl(data.url); //Daca nu-s erori extracem url-ul pozei si o salveaza in state
    } catch (err) {
      console.warn(err);
      alert("Eroare la incarcarea fisierului");
    }
    // Logica pentru a gestiona încărcarea fișierelor
  };

  // Mută funcția onClickRemoveImage la nivel de componentă
  const onClickRemoveImage = () => {
    setImageUrl("");
  };

  // Mută funcția onChange la nivel de componentă
  const onChange = React.useCallback((text) => {
    setText(text);
  }, []);
  const onSubmit = async () => {
    try {
      setLoading(true);

      const fields = {
        title,
        imageUrl,
        tags,
        text,
      };

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post("/posts", fields);

      const _id = isEditing ? id : data._id;

      navigate(`/posts/${_id}`);
    } catch (err) {
      console.log(err);
      console.warn(err.response.data);
      alert("Nu s-a reusit crearea postarii");
    }
  };

  React.useEffect(() => {
    if (id) {
      // Daca am putut obtine id-ul inseamna ca este redactarea postarii
      axios
        .get(`/posts/${id}`)
        .then((response) => {
          const data = response.data; // Extragem datele din răspuns
          // Facem req și salvăm modificările
          setTitle(data.title);
          setText(data.text);
          setTags(data.tags.join(",")); // Dacă tags este un array, îl transformăm într-un string
          setImageUrl(data.imageUrl);
        })
        .catch((err) => {
          console.warn(err);
          alert("Eroare la obținerea postării");
        });
    }
  }, [id]); // Adăugăm id ca dependență pentru useEffect

  // Mută opțiunile SimpleMDE la nivel de componentă
  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={() => inputFilleRef.current.click()} //Pentru a putea incarca fisiere pe pagina
        variant="outlined"
        size="large"
      >
        Загрузить превью
      </Button>
      <input
        ref={inputFilleRef}
        type="file"
        onChange={handleChangeFile}
        hidden
      />
      {imageUrl && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
          >
            Удалить
          </Button>
          <img
            className={styles.image}
            src={`http://localhost:4444${imageUrl}`}
            alt="Uploaded"
          />
        </>
      )}

      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title} // Înlocuiește `text` cu `value`
        onChange={(e) => setTitle(e.target.value)} // Folosește `e.target.value`
        fullWidth
      />

      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? "Modifică" : "Publică"}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
