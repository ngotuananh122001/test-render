import { IPaginationOptions, Pagination } from "nestjs-typeorm-paginate";
import * as CryptoJS from "crypto-js";
import { SelectQueryBuilder } from "typeorm";
import { Causes } from "src/config/exception/causes";

export function nowInMillis(): number {
  return Date.now();
}

// Alias for nowInMillis
export function now(): number {
  return nowInMillis();
}

export function nowInSeconds(): number {
  return (nowInMillis() / 1000) | 0;
}

export function addHttps(url: string) {
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
    url = "https://" + url;
  }
  return url;
}

export function checkIPaginationOptions(options: IPaginationOptions): boolean {
  if (options.limit == 0 || options.page == 0) {
    return false;
  }
  return true;
}

export function encrypt(data: string) {
  return CryptoJS.MD5(data).toString();
}

export function randomString(length: number) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function randomNumberCode(length: number) {
  var result = "";
  var characters = "0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function convertToSlug(Text: string) {
  return Text.toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}

export function convertToString(value: any) {
  return typeof value === "string" ? value : "";
}

export function isNumber(value: any) {
  if (value.match(/^\d+$/)) {
    ///^[+-]?\d+(\.\d+)?$/
    return true;
  } else {
    return false;
  }
}

export function isFloat(value: any) {
  if (value.match(/^[+-]?\d+(\.\d+)?$/)) {
    return true;
  } else {
    return false;
  }
}

export function isPhoneNumber(inputtxt) {
  var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if (inputtxt.match(phoneno)) {
    return true;
  } else {
    return false;
  }
}

export function checkImage(file) {
  const listType = [
    "JPG",
    "JPEG",
    "PNG",
    "GIF",
    "SVG",
    "MP4",
    "WEBM",
    "MP3",
    "MPEG",
    "WAV",
    "OGG",
    "GLB",
    "GLTF",
    "SVG+XML",
    "OCTET-STREAM",
    "STL",
    "3MF",
    "3DS",
    "MAX",
    "OBJ",
    "COLLADA",
    "VRML",
    "X3D",
    "STP",
    "FBX",
    "GLTF-BINARY"
  ];
  const imgType = file.mimetype.split("/")[1].toUpperCase();
  const imgSize = file.size;

  if (imgSize > 100 * 1000 * 1000) throw Causes.FILE_SIZE_OVER;

  if (!listType.includes(imgType)) throw Causes.FILE_TYPE_INVALID;

  return true;
}

export function convertToObject(value: any) {
  return typeof value === "object" ? value : {};
}

export function getArrayPagination<T>(
  totalItems: any[],
  options: any
): Pagination<T> {
  const { limit, page } = options;

  const selectedItems = totalItems.slice((page - 1) * limit, page * limit);
  const pagination = {
    totalItems: totalItems.length,
    itemCount: selectedItems.length,
    itemsPerPage: limit,
    totalPages: Math.ceil(totalItems.length / limit),
    currentPage: page,
  };

  return new Pagination(selectedItems, pagination, null);
}

export function getArrayPaginationBuildTotal<T>(
  totalItems: any[],
  totalData: any[],
  options: any
): Pagination<T> {
  const { limit, page } = options;

  const selectedItems = totalItems;
  let totalRecord = 0
  if(totalData.length > 0){
    totalRecord = totalData[0].Total;
  }
  const pagination = {
    totalItems: Number(totalRecord),
    itemCount: Number(totalRecord),
    itemsPerPage: Number(limit),
    totalPages: Math.ceil(Number(totalRecord) / limit),
    currentPage: Number(page),
  };

  return new Pagination(selectedItems, pagination, null);
}

export function existValueInEnum(type: any, value: any): boolean {
  return (
    Object.keys(type)
      .filter((k) => isNaN(Number(k)))
      .filter((k) => type[k] === value).length > 0
  );
}

export function getOffset(paginationOptions: IPaginationOptions) {
  let offset = 0;
  if (paginationOptions.page && paginationOptions.limit) {
      if (paginationOptions.page > 0) {
          offset = (Number(paginationOptions.page) - 1) * Number(paginationOptions.limit);
      }
  }
  return offset;
}
