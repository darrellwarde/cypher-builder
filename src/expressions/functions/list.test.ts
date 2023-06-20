/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { TestClause } from "../../utils/TestClause";
import Cypher from "../..";

describe("List Functions", () => {
    test.each(["size", "head", "last"] as const)("%s", (value) => {
        const testList = new Cypher.List([new Cypher.Literal(2)]);
        const listFn = Cypher[value](testList);

        const queryResult = new TestClause(listFn).build();

        expect(queryResult.cypher).toBe(`${value}([ 2 ])`);
        expect(queryResult.params).toEqual({});
    });

    test("labels", () => {
        const node = new Cypher.Node({ labels: ["Movie"] });
        const labelsFn = Cypher.labels(node);

        const queryResult = new TestClause(labelsFn).build();
        expect(queryResult.cypher).toMatchInlineSnapshot(`"labels(this0)"`);
        expect(queryResult.params).toMatchInlineSnapshot(`{}`);
    });

    test("reduce", () => {
        const acc = new Cypher.Variable();

        const listElement = new Cypher.Variable();

        const listExpr = new Cypher.List([new Cypher.Param(2), new Cypher.Param(3)]);

        const reduceFn = Cypher.reduce(acc, new Cypher.Param(0), listElement, listExpr, Cypher.plus(acc, listElement));

        const queryResult = new TestClause(reduceFn).build();
        expect(queryResult.cypher).toMatchInlineSnapshot(
            `"reduce(var0 = $param0, var1 IN [ $param1, $param2 ] | (var0 + var1))"`
        );
        expect(queryResult.params).toMatchInlineSnapshot(`
            {
              "param0": 0,
              "param1": 2,
              "param2": 3,
            }
        `);
    });
});
