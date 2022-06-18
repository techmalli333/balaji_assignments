//   React.useEffect(() => {
//     axios
//       .get("https://api.coinstats.app/public/v1/coins/")
//       .then((res) => setData(res.data.coins));
//   });

// }

// import axios from "axios";
const axios = require("axios");

// axios.get("https://api.coinstats.app/public/v1/coins/").then(async (res) => {
//   const data = await res.data;
//   console.log(data);
// });

const result = async () => {
  try {
    const res = await axios.get("https://api.coinstats.app/public/v1/coins/");
    const data = res.data;
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

result();
