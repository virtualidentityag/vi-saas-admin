/*
 * routes
 */
export const routePathNames = {
  login: "/login",
  themeSettings: "theme-settings",
  counselors: "/berater/",
  counselorProfileEdit: "/berater/bearbeiten/",
  counselorProfileAdd: "/benutzer/anlegen/",
  userProfile: "/profil/",
  termsAndConditions: "/agb",
  imprint: "/impressum",
  privacy: "/datenschutz",
  tenants: "/organisationen",
};

/*
 * message texts and config for ant design message component
 */
export const messageData = {
  success: {
    auth: {
      login: {
        content: "Login erfolgreich. Weiterleitung...",
        duration: 1,
      },
      setPassword: {
        content: "Passwort erfolgreich geändert!",
      },
      resetPassword: {
        content:
          "Passwort erfolgreich zurückgesetzt! Wenn diese E-Mail vorhanden ist, erhalten Sie einen Link zum Zurücksetzen!",
      },
    },
  },
  warning: {
    cancelRequest: {
      content: "Der Vorgang wurde abgebrochen.",
    },
  },
  error: {
    unexpected: {
      content: "Ein unerwarteter Fehler ist aufgetreten.",
      duration: 5,
    },

    auth: {
      login: {
        content:
          "Login fehlgeschlagen. Bitte überprüfen Sie E-Mail und Passwort.",
        duration: 5,
      },
      setPassword: {
        content:
          "Passwortänderung fehlgeschlagen! Bitte überprüfen Sie, ob Sie den richtigen Link geöffnet haben. Sie können auch einen neuen Link anfordern.",
        duration: 5,
      },
      resetPassword: {
        content: "Zurücksetzen fehlgeschlagen.",
      },
    },
  },
};
