"use client";

import {
  Form,
  Button,
  Input,
  Autosuggest,
  FormField,
} from "@cloudscape-design/components";
import { useState, useCallback, useMemo } from "react";
import { appendToHistory, getHistory, setHistory } from "../ui/history";

export const AddressForm = () => {
  const [address, setAddress] = useState("");
  const history = getHistory().map((value) => ({ value }));

  const navigateToInsights = useCallback(() => {
    appendToHistory(address);
    window.location.href = `/insights?address=${address}`;
  }, [address]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setAddress("");
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (address.length > 0) {
          navigateToInsights();
        }
      }}
    >
      <Form
        actions={
          <Button variant="primary" disabled={address.length === 0}>
            View Insights
          </Button>
        }
        secondaryActions={
          <Button
            variant="inline-link"
            formAction={"none"}
            onClick={clearHistory}
          >
            Clear History
          </Button>
        }
      >
        <FormField
          label={"Address"}
        >
          <Autosuggest
            value={address}
            onChange={(event) => setAddress(event.detail.value)}
            placeholder={"1150 John F Kennedy Blvd, Bayonne, NJ..."}
            options={history}
            empty={""}
          />
        </FormField>
      </Form>
    </form>
  );
};
