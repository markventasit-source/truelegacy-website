import fatherPng from "../assets/img/succession/father.png";
import motherPng from "../assets/img/succession/mother.png";
import sonPng from "../assets/img/succession/son.png";
import daughterPng from "../assets/img/succession/daughter.png";
import brotherPng from "../assets/img/succession/brother.png";
import sisterPng from "../assets/img/succession/sister.png";
import youMale from "../assets/img/succession/you_male.png";
import youFemale from "../assets/img/succession/you_female.png";

const imageMap = {
  father: fatherPng,
  mother: motherPng,
  son: sonPng,
  daughter: daughterPng,
  brother: brotherPng,
  sister: sisterPng,
};

export const getMemberImage = (relationship = "", gender = "male") => {
  const rel = String(relationship).toLowerCase();
  const g = String(gender).toLowerCase();

  if (imageMap[rel]) return imageMap[rel];

  if (["you", "self"].includes(rel)) {
    return g === "female" ? youFemale : youMale;
  }

  if (["spouse", "wife", "husband"].includes(rel)) {
    if (rel === "wife") return youFemale;
    if (rel === "husband") return youMale;
    return g === "female" ? youFemale : youMale;
  }

  // default fallback
  return g === "female" ? youFemale : youMale;
};
