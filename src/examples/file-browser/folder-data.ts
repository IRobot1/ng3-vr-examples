import { FileData } from "ngx-cloud-storage-types";

export const rootfolder: Array<FileData> = [
  {
    "isfolder": true,
    "name": "food",
    "id": "food",
    "extension": "folder",
    "lastmodified": '2023-01-25T00:00:00',
    "size": ""
  },
  {
    "isfolder": true,
    "name": "sea",
    "id": "sea",
    "extension": "folder",
    "lastmodified": '2023-01-25T00:00:00',
    "size": ""
  },
  {
    "isfolder": false,
    "name": "spiro1.ply",
    "id": "spiro1.ply",
    "extension": "ply",
    "lastmodified": '2023-01-25T00:00:00',
    "size": "1 MB",
    "downloadurl": "assets/spiro1.ply"
  },
  {
    "isfolder": false,
    "name": "apple.gltf",
    "id": "apple.gltf",
    "extension": "gltf",
    "lastmodified": '2023-01-25T00:00:00',
    "size": "3 KB",
    "downloadurl": "assets/food/apple.gltf"
  },
  {
    "isfolder": false,
    "name": "head.gltf",
    "id": "head.gltf",
    "extension": "gltf",
    "lastmodified": '2023-01-25T00:00:00',
    "size": "3 KB",
    "downloadurl": "assets/head/statue.gltf"
  },
  {
    "isfolder": false,
    "name": "horse.gltf",
    "id": "horse.gltf",
    "extension": "gltf",
    "lastmodified": '2023-01-25T00:00:00',
    "size": "6 KB",
    "downloadurl": "assets/horse/statue.gltf"
  },
  {
    "isfolder": false,
    "name": "LittlestTokyo.glb",
    "id": "LittlestTokyo.glb",
    "extension": "glb",
    "lastmodified": '2023-01-25T00:00:00',
    "size": "3.9 MB",
    "downloadurl": "assets/LittlestTokyo.glb"
  }
]

export const foodFolder: Array<FileData> = [
  {
    "isfolder": false,
    "name": "apple.gltf",
    "id": "apple.gltf",
    "extension": "gltf",
    "lastmodified": '2023-01-25T00:00:00',
    "size": "3 KB",
    "downloadurl": "assets/food/apple.gltf"
  },

]

export const seaFolder: Array<FileData> = [
  {
    "isfolder": false,
    "name": "local dolphins.ply",
    "id": "ldolphins.ply",
    "extension": "ply",
    "lastmodified": '2023-01-25T00:00:00',
    "size": "47 KB",
    "downloadurl": "assets/dolphins.ply"
  },
  {
    "isfolder": false,
    "name": "airplane.ply",
    "id": "airplane.ply",
    "extension": "ply",
    "lastmodified": '2023-01-25T00:00:00',
    "size": "47 KB",
    "downloadurl": "https://people.sc.fsu.edu/~jburkardt/data/ply/airplane.ply"
  },

]

