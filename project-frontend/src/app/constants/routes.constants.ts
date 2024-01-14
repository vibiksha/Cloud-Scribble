export const BASE_ROUTE = "http://ec2-13-236-200-152.ap-southeast-2.compute.amazonaws.com:8080";
// export const BASE_ROUTE = "http://localhost:8080"
export const BACKEND_ROUTES = {
  SIGNUP: BASE_ROUTE + "/auth/signup",

  LOGIN: BASE_ROUTE + "/auth/login",

  CREATE_POST: BASE_ROUTE + "/posts/create",

  DISPLAY_ALL: BASE_ROUTE + "/posts/all",

  UPDATE: BASE_ROUTE + "/posts/update",

  DISPLAY_BY_NAME: BASE_ROUTE + "/posts",

  DELETE: BASE_ROUTE + "/posts/delete",

};

export const ROUTES={
  LANDING:"/",
  DASHBOARD:"dashboard",
  MYPOST:"dashboard/myPost",
  ALLPOST:"dashboard/allPost",
  SIGNUP:"auth/signup",
  LOGIN:"auth/login"
}
