import * as React from "react";

export default function useRecaptcha() {
  React.useEffect(() => {
    const loadScriptByURL = (id: string, url: string) => {
      const isScriptExist = document.getElementById(id);

      if (!isScriptExist) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.id = id;
        document.body.appendChild(script);
      }
    };

    loadScriptByURL(
      "recaptcha-key",
      `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_KEY}`
    );
  }, []);
}
