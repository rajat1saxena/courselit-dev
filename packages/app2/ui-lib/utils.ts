import fetch from "isomorphic-unfetch";
import {
  URL_EXTENTION_POSTS,
  URL_EXTENTION_COURSES,
  permissions,
} from "../ui-config/constants.js";
import { RichText as TextEditor } from "../components/ComponentsLibrary";
import defaultState from "../state/default-state.js";
import Profile from "../ui-models/profile.js";

export const queryGraphQL = async (
  url: string,
  query: Record<string, unknown>,
  token: string
) => {
  const options = {
    method: "POST",
    headers: token
      ? {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      : { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  };
  let response: any = await fetch(url, options);
  response = await response.json();

  if (response.errors && response.errors.length > 0) {
    throw new Error(response.errors[0].message);
  }

  return response.data;
};

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const queryGraphQLWithUIEffects =
  (
    backend: string,
    dispatch: any,
    networkAction: (status: boolean) => void,
    token: string
  ) =>
  async (query: Record<string, unknown>) => {
    try {
      dispatch(networkAction(false));
      const response = await queryGraphQL(`${backend}/graph`, query, token);

      return response;
    } finally {
      dispatch(networkAction(false));
    }
  };

export const formattedLocaleDate = (epochString: string) =>
  new Date(Number(epochString)).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// Regex copied from: https://stackoverflow.com/a/48675160/942589
export const makeGraphQLQueryStringFromJSObject = (
  obj: Record<string, unknown>
) => JSON.stringify(obj).replace(/"([^(")"]+)":/g, "$1:");

export const formulateCourseUrl = (course: any, backend = "") =>
  `${backend}/${course.isBlog ? URL_EXTENTION_POSTS : URL_EXTENTION_COURSES}/${
    course.courseId
  }/${course.slug}`;

export const getPostDescriptionSnippet = (rawDraftJSContentState: any) => {
  const firstSentence = TextEditor.hydrate({ data: rawDraftJSContentState })
    .getCurrentContent()
    .getPlainText()
    .split(".")[0];

  return firstSentence ? firstSentence + "." : firstSentence;
};

export const getGraphQLQueryFields = (
  jsObj: any,
  fieldsNotPutBetweenQuotes = []
) => {
  let queryString = "{";
  for (const i of Object.keys(jsObj)) {
    if (jsObj[i] !== undefined) {
      queryString += fieldsNotPutBetweenQuotes.includes(i)
        ? `${i}: ${jsObj[i]},`
        : `${i}: "${jsObj[i]}",`;
    }
  }
  queryString += "}";

  return queryString;
};

export const getObjectContainingOnlyChangedFields = (
  baseline: Record<string, unknown>,
  obj: Record<string, unknown>
) => {
  const result: Record<string, unknown> = {};
  for (const i of Object.keys(baseline)) {
    if (baseline[i] !== obj[i]) {
      result[i] = obj[i];
    }
  }
  return result;
};

export const areObjectsDifferent = (
  baseline: Record<string, unknown>,
  obj: Record<string, unknown>
) => {
  const onlyChangedFields = getObjectContainingOnlyChangedFields(baseline, obj);
  return !!Object.keys(onlyChangedFields).length;
};

export const getAddress = (host: string) => {
  return {
    domain: extractDomainFromURL(host),
    backend: getBackendAddress(host),
    frontend: `http://${host}`,
  };
};

export const getBackendAddress = (host: string) => {
  const domain = extractDomainFromURL(host);

  if (process.env.NODE_ENV === "production") {
    return `${
      process.env.INSECURE === "true" ? "http" : "https"
    }://${domain}/api`;
  } else {
    return `http://${domain}:8000`;
  }
};

export const checkPermission = (
  actualPermissions: string[],
  desiredPermissions: string[]
) =>
  actualPermissions.some((permission) =>
    desiredPermissions.includes(permission)
  );

const extractDomainFromURL = (host: string) => {
  return host.split(":")[0];
};

export const canAccessDashboard = (profile: Profile) => {
  return checkPermission(profile.permissions, [
    permissions.manageCourse,
    permissions.manageAnyCourse,
    permissions.manageMedia,
    permissions.manageAnyMedia,
    permissions.manageLayout,
    permissions.manageThemes,
    permissions.manageMenus,
    permissions.manageWidgets,
    permissions.manageSettings,
    permissions.manageUsers,
    permissions.viewAnyMedia,
  ]);
};

export const constructThumbnailUrlFromFileUrl = (url: string) =>
  url ? url.replace(url.split("/").pop(), "thumb.webp") : null;