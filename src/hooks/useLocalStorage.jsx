<<<<<<< HEAD
import { useEffect } from "react";
import { useState } from "react"
=======
import { useEffect, useState } from "react";
>>>>>>> daftarbelanja/master

const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const localValue = window.localStorage.getItem(key);
      return localValue ? JSON.parse(localValue) : initialValue;
    } catch (err) {
<<<<<<< HEAD
      console.log(err)
      return initialValue;
    }
  })

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
export default useLocalStorage
=======
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;
>>>>>>> daftarbelanja/master
