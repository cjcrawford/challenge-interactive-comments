import { currentUser } from "../data.json";
import { reactive, computed } from "vue";

const localData = localStorage.getItem("user");

export const user = reactive({
  commentVotes: {},
  ...(localData ? JSON.parse(localData) : currentUser),
});

export const isLoggedIn = computed(() => !!user.username);

export const logout = () => {
  user.image = {
    png: "",
    webp: "",
  };
  user.username = "";
  user.commentVotes = {};

  localStorage.removeItem("user");
};
