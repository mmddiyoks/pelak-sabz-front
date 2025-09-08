import { useState } from "react";
import { useZxing } from "react-zxing";

const BarcodeScanner = ({ handleScan }: { handleScan: (code: string) => void }) => {
  const [result, setResult] = useState("");
  const { ref } = useZxing({
    onDecodeResult(result) {
      const qrlBaseResult = "?key=";

      if (result.getText().includes(qrlBaseResult)) {
        const code = result.getText().split(qrlBaseResult, 2)[1]
        setResult(code)
        handleScan(code);



      }


    },
  });

  return (
    <>
      <video width="300" height="200" ref={ref} className="rounded-md " />
      <p>

        <span>{result}</span>
      </p>
    </>
  );
};

export default BarcodeScanner