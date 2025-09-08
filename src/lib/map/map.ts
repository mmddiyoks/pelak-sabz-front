import axios from "axios";

export enum OPERATOR {
  like = "ILIKE",
  less_than = "<",
  equal_to = "=",
  greater_than_equal_to = ">=",
  less_then_equal_to = "<=",
}

export const getInfoByAttribute = (
  url: string,
  layer: string,
  field: string,
  operator: OPERATOR,
  value: string,
  srsName: string,
  callback?: (data: any) => void,
  errHandller = null
) => {
  let reqValue = operator === OPERATOR.like ? `%25${value}%25` : value;
  let urlReq =
    url +
    "?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
    layer +
    "&CQL_FILTER=" +
    field +
    "+" +
    operator +
    "+'" +
    reqValue +
    "'&outputFormat=application/json&srsName=" +
    srsName;

  axios
    .get(urlReq)
    .then((req) => {
      if (callback) {
        callback(req.data.features);
      } else {
        return req.data;
      }
    })
    .catch((error) => {
      //@ts-ignore
      errHandller && errHandller();
      console.error("Error fetching data:", error);
    });
};
export const FeatureInfoUrlCreator = async (
  layer: any,
  clickedCoordinate: number[],
  resolution: number,
  projection: string
) => {
  const url = layer
    .getSource()
    .getFeatureInfoUrl(clickedCoordinate, resolution, projection, {
      INFO_FORMAT: "application/json",
      FEATURE_COUNT: 1,
    });
  const data = await fetch(url)
    .then((response) => response.text())
    .then(function (text) {
      let features = JSON.parse(text);
      return features;
    });
  return data;
};
