export const ROUTE_SEEDS = [
  { code: "RT-SEA-KRPUS-CNSHA", originCode: "PORT-KRPUS", destinationCode: "PORT-CNSHA", transportMode: "SEA", transshipmentAllowed: true },
  { code: "RT-SEA-KRPUS-JPTYO", originCode: "PORT-KRPUS", destinationCode: "PORT-JPTYO", transportMode: "SEA", transshipmentAllowed: false },
  { code: "RT-SEA-KRPUS-SGSIN", originCode: "PORT-KRPUS", destinationCode: "PORT-SGSIN", transportMode: "SEA", transshipmentAllowed: true },
  { code: "RT-SEA-KRPUS-VNHPH", originCode: "PORT-KRPUS", destinationCode: "PORT-VNHPH", transportMode: "SEA", transshipmentAllowed: true },
  { code: "RT-SEA-KRPUS-USLAX", originCode: "PORT-KRPUS", destinationCode: "PORT-USLAX", transportMode: "SEA", transshipmentAllowed: true },
  { code: "RT-SEA-KRPUS-NLRTM", originCode: "PORT-KRPUS", destinationCode: "PORT-NLRTM", transportMode: "SEA", transshipmentAllowed: true },
  { code: "RT-AIR-ICN-PVG", originCode: "AIR-ICN", destinationCode: "AIR-PVG", transportMode: "AIR", transshipmentAllowed: false },
  { code: "RT-AIR-ICN-NRT", originCode: "AIR-ICN", destinationCode: "AIR-NRT", transportMode: "AIR", transshipmentAllowed: false },
  { code: "RT-AIR-ICN-SIN", originCode: "AIR-ICN", destinationCode: "AIR-SIN", transportMode: "AIR", transshipmentAllowed: true },
  { code: "RT-AIR-ICN-LAX", originCode: "AIR-ICN", destinationCode: "AIR-LAX", transportMode: "AIR", transshipmentAllowed: true },
  { code: "RT-AIR-ICN-FRA", originCode: "AIR-ICN", destinationCode: "AIR-FRA", transportMode: "AIR", transshipmentAllowed: true },
  { code: "RT-AIR-ICN-DXB", originCode: "AIR-ICN", destinationCode: "AIR-DXB", transportMode: "AIR", transshipmentAllowed: true },
] as const;
