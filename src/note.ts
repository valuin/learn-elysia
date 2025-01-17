import { Elysia, t } from "elysia";

class Note {
  constructor(public data: string[] = ["Moonhalo"]) {}

  add(note: string) {
    this.data.push(note);

    return this.data;
  }

  remove(index: number) {
    return this.data.splice(index, 1);
  }

  update(index: number, note: string) {
    return (this.data[index] = note);
  }
}

export const note = new Elysia({ prefix: "/note" })
  .decorate("note", new Note())
  .onTransform(({ body, params, path, request: { method } }) => {
    // Basic logging
    console.log(`[${new Date().toISOString()}] ${method} ${path}`);
    
    // Detailed logging
    if (body || params) {
      console.log({
        timestamp: new Date().toISOString(),
        method,
        path,
        body,
        params
      });
    }
  })
  .get("", ({ note }) => note.data)
  .post("", ({ note, body: { data } }) => note.add(data), {
    body: t.Object({
      data: t.String(),
    }),
  })
  .guard({
    params: t.Object({
      index: t.Number(),
    }),
  })
  .get("/:index", ({ note, params: { index }, error }) => {
    return note.data[index] ?? error(404, "Not Found :(");
  })
  .delete("/:index", ({ note, params: { index }, error }) => {
    if (index in note.data) return note.remove(index);

    return error(422);
  })
  .patch(
    "/:index",
    ({ note, params: { index }, body: { data }, error }) => {
      if (index in note.data) return note.update(index, data);

      return error(422);
    },
    {
      params: t.Object({
        index: t.Number(),
      }),
      body: t.Object({
        data: t.String(),
      }),
    }
  );
