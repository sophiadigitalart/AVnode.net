import { validateSlugNewVideos } from "../../common/form/validators";
import { checkIfError } from "../../common/form";

const asyncValidate = (values, dispatch, state) => {
  const promises = [];
  const result = {};
  // slug
  validateSlugNewVideos({
    value: values.slug,
    previousValue: state.initialValues.slug,
    promises,
    result
  });

  return Promise.all(promises)
    .then(() => {
      return checkIfError(result);
    })
    .catch(() => {
      return checkIfError(result);
    });
};

export default asyncValidate;
