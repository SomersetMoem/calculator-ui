import React, { useState } from "react";
import Display from "./Display";
import ButtonGrid from "./ButtonGrid";
import "../styles/Calculator.css";

/**
 * BACKEND API REQUIREMENTS (Java + Spring Boot):
 *
 * Base URL: /api/calculator
 *
 * 1. POST /api/calculator/operation
 *    Body: { "operation": "ADD|SUBTRACT|MULTIPLY|DIVIDE", "operand1": number, "operand2": number }
 *    Response: { "result": number }
 *    Example: POST { "operation": "ADD", "operand1": 5, "operand2": 3 } → { "result": 8 }
 *
 * 2. POST /api/calculator/negate
 *    Body: { "value": number }
 *    Response: { "result": number }
 *    Example: POST { "value": 5 } → { "result": -5 }
 *
 * 3. POST /api/calculator/percent
 *    Body: { "value": number }
 *    Response: { "result": number }
 *    Example: POST { "value": 50 } → { "result": 0.5 }
 *
 * 4. POST /api/calculator/validate-number
 *    Body: { "input": string, "currentValue": string }
 *    Response: { "isValid": boolean, "newValue": string }
 *    Example: POST { "input": "5", "currentValue": "0" } → { "isValid": true, "newValue": "5" }
 *             POST { "input": ".", "currentValue": "5.5" } → { "isValid": false, "newValue": "5.5" }
 *
 * 5. POST /api/calculator/format-display
 *    Body: { "value": number }
 *    Response: { "formattedValue": string }
 *    Example: POST { "value": 1234.567890123 } → { "formattedValue": "1234.5678901" }
 *
 * Error responses should follow format: { "error": "Error message", "code": "ERROR_CODE" }
 * All endpoints should handle edge cases like division by zero, invalid inputs, etc.
 */

/**
 * BACKEND API REQUIREMENTS (Java + Spring Boot):
 *
 * Base URL: /api/calculator
 *
 * 1. POST /api/calculator/operation
 *    Body: { "operation": "ADD|SUBTRACT|MULTIPLY|DIVIDE", "operand1": number, "operand2": number }
 *    Response: { "result": number }
 *    Example: POST { "operation": "ADD", "operand1": 5, "operand2": 3 } → { "result": 8 }
 *
 * 2. POST /api/calculator/negate
 *    Body: { "value": number }
 *    Response: { "result": number }
 *    Example: POST { "value": 5 } → { "result": -5 }
 *
 * 3. POST /api/calculator/percent
 *    Body: { "value": number }
 *    Response: { "result": number }
 *    Example: POST { "value": 50 } → { "result": 0.5 }
 *
 * 4. POST /api/calculator/validate-number
 *    Body: { "input": string, "currentValue": string }
 *    Response: { "isValid": boolean, "newValue": string }
 *    Example: POST { "input": "5", "currentValue": "0" } → { "isValid": true, "newValue": "5" }
 *             POST { "input": ".", "currentValue": "5.5" } → { "isValid": false, "newValue": "5.5" }
 *
 * 5. POST /api/calculator/format-display
 *    Body: { "value": number }
 *    Response: { "formattedValue": string }
 *    Example: POST { "value": 1234.567890123 } → { "formattedValue": "1234.5678901" }
 *
 * Error responses should follow format: { "error": "Error message", "code": "ERROR_CODE" }
 * All endpoints should handle edge cases like division by zero, invalid inputs, etc.
 */

// Интерфейсы для типизации запросов и ответов
interface OperationRequest {
  operation: string;
  operand1: number;
  operand2: number;
}

interface OperationResponse {
  result: number;
}

interface NegateRequest {
  value: number;
}

interface NegateResponse {
  result: number;
}

interface PercentRequest {
  value: number;
}

interface PercentResponse {
  result: number;
}

interface ValidateRequest {
  input: string;
  currentValue: string;
}

interface ValidateResponse {
  isValid: boolean;
  newValue: string;
}

interface FormatRequest {
  value: number;
}

interface FormatResponse {
  formattedValue: string;
}

interface ErrorResponse {
  error: string;
  code?: string;
}

// Тип для операции
interface Operation {
  previousValue: number;
  currentValue: number;
  operator: string;
}

// Универсальная функция для API запросов
const apiRequest = (endpoint: string, data: any): Promise<any> => {
  return fetch(`/api/calculator/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json().then((responseData) => {
        if (!response.ok) {
          const errorData = responseData as ErrorResponse;
          throw new Error(errorData.error || "API request failed");
        }
        return responseData;
      });
    })
    .catch((error) => {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    });
};

// Обновлённая функция для вычислений
const calculateOnBackend = (operation: Operation): Promise<number> => {
  const operationMap: Record<string, string> = {
    "+": "ADD",
    "-": "SUBTRACT",
    "*": "MULTIPLY",
    "/": "DIVIDE",
  };

  const requestData: OperationRequest = {
    operation: operationMap[operation.operator],
    operand1: operation.previousValue,
    operand2: operation.currentValue,
  };

  return apiRequest("operation", requestData)
    .then((result: OperationResponse) => {
      if (typeof result.result !== "number") {
        throw new Error("Unexpected response type from server");
      }
      return result.result;
    })
    .catch((err) => {
      const message =
        err instanceof Error ? err.message : "Unknown error occurred";
      throw new Error(message);
    });
};

// API функция для смены знака
const negateOnBackend = (value: number): Promise<number> => {
  const requestData: NegateRequest = { value };
  return apiRequest("negate", requestData).then(
    (result: NegateResponse) => result.result
  );
};

// API функция для процента
const percentOnBackend = (value: number): Promise<number> => {
  const requestData: PercentRequest = { value };
  return apiRequest("percent", requestData).then(
    (result: PercentResponse) => result.result
  );
};

// API функция для валидации числового ввода
const validateNumberInput = (
  input: string,
  currentValue: string
): Promise<{ isValid: boolean; newValue: string }> => {
  const requestData: ValidateRequest = { input, currentValue };
  return apiRequest("validate-number", requestData).then(
    (result: ValidateResponse) => ({
      isValid: result.isValid,
      newValue: result.newValue,
    })
  );
};

// API функция для форматирования отображения
const formatDisplayValue = (value: number): Promise<string> => {
  const requestData: FormatRequest = { value };
  return apiRequest("format-display", requestData).then(
    (result: FormatResponse) => result.formattedValue
  );
};

const Calculator: React.FC = () => {
  const [currentValue, setCurrentValue] = useState("0");
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleButtonClick = (value: string) => {
    setError(null); // Сброс ошибки при новом действии

    // 🔹 Очистка (не требует бэкенд запроса)
    if (value === "C") {
      setCurrentValue("0");
      setPreviousValue(null);
      setOperator(null);
      return;
    }

    // 🔹 Смена знака (±) - запрос на бэкенд
    if (value === "±") {
      setIsLoading(true);
      const numValue = parseFloat(currentValue);
      if (isNaN(numValue)) {
        setError("Invalid number for negation");
        setIsLoading(false);
        return;
      }

      negateOnBackend(numValue)
        .then((result) => formatDisplayValue(result))
        .then((formattedResult) => {
          setCurrentValue(formattedResult);
          setIsLoading(false);
        })
        .catch((err) => {
          const errorMessage =
            err instanceof Error ? err.message : "Unknown error occurred";
          setError(errorMessage);
          setIsLoading(false);
        });
      return;
    }

    // 🔹 Процент (%) - запрос на бэкенд
    if (value === "%") {
      setIsLoading(true);
      const numValue = parseFloat(currentValue);
      if (isNaN(numValue)) {
        setError("Invalid number for percentage");
        setIsLoading(false);
        return;
      }

      percentOnBackend(numValue)
        .then((result) => formatDisplayValue(result))
        .then((formattedResult) => {
          setCurrentValue(formattedResult);
          setIsLoading(false);
        })
        .catch((err) => {
          const errorMessage =
            err instanceof Error ? err.message : "Unknown error occurred";
          setError(errorMessage);
          setIsLoading(false);
        });
      return;
    }

    // 🔹 Операторы (+, -, *, /) - сохраняем состояние
    if (["+", "-", "*", "/"].includes(value)) {
      // Если уже есть операция в процессе, сначала выполняем её
      if (previousValue && operator && currentValue !== "0") {
        setIsLoading(true);
        const prev = parseFloat(previousValue);
        const curr = parseFloat(currentValue);

        if (isNaN(prev) || isNaN(curr)) {
          setError("Invalid numbers for calculation");
          setIsLoading(false);
          return;
        }

        calculateOnBackend({
          previousValue: prev,
          currentValue: curr,
          operator: operator,
        })
          .then((result) => formatDisplayValue(result))
          .then((formattedResult) => {
            setPreviousValue(formattedResult);
            setCurrentValue("0");
            setOperator(value);
            setIsLoading(false);
          })
          .catch((err) => {
            const errorMessage =
              err instanceof Error ? err.message : "Unknown error occurred";
            setError(errorMessage);
            setIsLoading(false);
          });
      } else {
        setPreviousValue(currentValue);
        setOperator(value);
        setCurrentValue("0");
      }
      return;
    }

    // 🔹 Равно (=) - основные расчеты на бэкенде
    if (value === "=") {
      if (previousValue && operator) {
        setIsLoading(true);
        const prev = parseFloat(previousValue);
        const curr = parseFloat(currentValue);

        if (isNaN(prev) || isNaN(curr)) {
          setError("Invalid numbers for calculation");
          setIsLoading(false);
          return;
        }

        calculateOnBackend({
          previousValue: prev,
          currentValue: curr,
          operator: operator,
        })
          .then((result) => formatDisplayValue(result))
          .then((formattedResult) => {
            setCurrentValue(formattedResult);
            setPreviousValue(null);
            setOperator(null);
            setIsLoading(false);
          })
          .catch((err) => {
            const errorMessage =
              err instanceof Error ? err.message : "Unknown error occurred";
            setError(errorMessage);
            setIsLoading(false);
          });
      }
      return;
    }

    // 🔹 Цифры и точка - валидация через бэкенд
    validateNumberInput(value, currentValue)
      .then((validation) => {
        if (validation.isValid) {
          setCurrentValue(validation.newValue);
        }
      })
      .catch((err) => {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
      });
  };

  // Определяем что показывать на дисплее
  const getDisplayValue = () => {
    if (error) return "Error";
    if (isLoading) return "Loading...";
    return currentValue;
  };

  return (
    <div className="calculator">
      {error && (
        <div
          className="error-banner"
          style={{
            color: "red",
            textAlign: "center",
            fontSize: "12px",
            padding: "4px",
            backgroundColor: "#ffe6e6",
            border: "1px solid red",
            borderRadius: "4px",
            margin: "4px",
          }}
        >
          {error}
        </div>
      )}
      <Display value={getDisplayValue()} />
      <ButtonGrid onButtonClick={handleButtonClick} />
    </div>
  );
};

export default Calculator;
