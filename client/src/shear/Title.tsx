import { Helmet } from "react-helmet-async";

const Title = ({
  title = "Chat App",
  description = "This is the Chat App with AI feature",
}) => {
  return (
    <Helmet>
      <title> {title} </title>
      <meta name="description" content={description} />
    </Helmet>
  );
};

export default Title;
