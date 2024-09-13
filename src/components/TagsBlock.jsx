import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import TagIcon from "@mui/icons-material/Tag";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import { SideBlock } from "./SideBlock";

export const TagsBlock = ({ items, isLoading = true }) => {
  // Transformă obiectele în stringuri, dacă este necesar
  const renderedItems = isLoading
    ? [...Array(5)]
    : items.map(tag => tag.name || 'Unknown Tag'); // Asigură-te că folosești numele corect

  return (
    <SideBlock title="Тэги">
      <List>
        {renderedItems.map((name, i) => (
          <a
            key={isLoading ? i : name} // Folosește `name` ca cheie unică dacă datele sunt disponibile
            style={{ textDecoration: "none", color: "black" }}
            href={`/tags/${name}`}
          >
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <TagIcon />
                </ListItemIcon>
                {isLoading ? (
                  <Skeleton width={100} />
                ) : (
                  <ListItemText primary={name} />
                )}
              </ListItemButton>
            </ListItem>
          </a>
        ))}
      </List>
    </SideBlock>
  );
};
