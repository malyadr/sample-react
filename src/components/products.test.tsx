import { render, screen } from "@testing-library/react";
import Products from "./products";
import axios from "axios";
import { getProducts } from "../external/product";

// Mock axios
jest.mock("axios");

test("should fetch products successfully", async () => {
  const mockResponse = { data: [{ id: 1, name: "Test Product" }] };
  
  (axios.get as jest.Mock).mockResolvedValue(mockResponse);

  const result = await getProducts();
  expect(result).toEqual(mockResponse.data);
});

test("render shopping cart correctly", () => {
  render(<Products />);
  screen.getByTestId("products");
});

test("show product item correctly", () => {
  render(<Products />);
  // get product item with product ID = 1 (i.e. Face Masks)
  const faceMaskItem = screen.getByTestId("product-1");
  expect(faceMaskItem).toBeInTheDocument();
});

test("show product item name correctly", () => {
  render(<Products />);
  // get product item with product ID = 1 (i.e. Face Masks)
  const faceMaskItem = screen.getByTestId("product-name-1");
  expect(faceMaskItem).toHaveTextContent("Face Masks");
});

test("show product item price correctly", () => {
  render(<Products />);
  // get product item with product ID = 1 (i.e. Face Masks)
  const faceMaskItem = screen.getByTestId("product-price-1");
  expect(faceMaskItem).toHaveTextContent("£2.50");
});
