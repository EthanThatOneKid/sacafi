// Dependencies
import { default as format } from "date-fns/format";

// Export date filter helper function
export default date => {
  return format(new Date(date), "MMMM D, YYYY");
};
