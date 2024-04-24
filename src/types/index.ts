import React from "react";

/* ------------ CONTEXT TYPES ------------ */
export type AuthContextType = {
  user: TUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<TUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

/* ------------ NAVIGATION TYPES ------------ */
export type TNavLink = {
  imgUrl: string;
  route: string;
  label: string;
};

/* ------------ POST TYPES ------------ */
export type TNewPost = {
  userId: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
};

export type TUpdatePost = {
  postId: string;
  caption: string;
  imageId: string;
  imageUrl: URL;
  file: File[];
  location?: string;
  tags?: string;
};

/* ---------- USER TYPES ------------ */
export type TNewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};

export type TUser = {
  id: string;
  name: string;
  email: string;
  username: string;
  imageUrl: string;
  bio: string;
};

export type TUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
};
