import { Container, Heading } from "@chakra-ui/react";
import React, { useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <Container>
      <Heading>Hello World!</Heading>
    </Container>
  );
}
