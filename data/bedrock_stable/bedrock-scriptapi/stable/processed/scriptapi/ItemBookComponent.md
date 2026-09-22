> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.354Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# ItemBookComponent (class)

```ts
export class ItemBookComponent extends ItemComponent {
```

## Members（14）

### `private`
```ts
private constructor();
```

### `author`
```ts
readonly author?: string;
```

@remarks
The name of the author of the book if it is signed,
otherwise undefined.

@throws This property can throw when used.

{@link InvalidItemStackError}
/

### `contents`
```ts
readonly contents: (string | undefined)[];
```

@remarks
The contents of pages in the book that are in string format.
Entries not in string format will be undefined.

@throws This property can throw when used.

{@link InvalidItemStackError}
/

### `isSigned`
```ts
readonly isSigned: boolean;
```

@remarks
Determines whether the book has been signed or not.

@throws This property can throw when used.

{@link InvalidItemStackError}
/

### `pageCount`
```ts
readonly pageCount: number;
```

@remarks
The amount of pages the book has.

@throws This property can throw when used.

{@link InvalidItemStackError}
/

### `rawContents`
```ts
readonly rawContents: (RawMessage | undefined)[];
```

@remarks
The contents of pages in the book that are in {@link
RawMessage} format. Entries not in {@link RawMessage} format
will be undefined.

@throws This property can throw when used.

{@link InvalidItemStackError}
/

### `title`
```ts
readonly title?: string;
static readonly componentId = 'minecraft:book';
```

@remarks
The title of the book if it is signed, otherwise undefined.

@throws This property can throw when used.

{@link InvalidItemStackError}
/

### `getPageContent`
```ts
getPageContent(pageIndex: number): string | undefined;
```

@remarks
Gets the string format content of a page for a given index.

@param pageIndex
The index of the page.
@returns
The content of the page if a valid index is provided and it
is in string format, otherwise returns undefined.
@throws This function can throw errors.

{@link InvalidItemStackError}
/

### `getRawPageContent`
```ts
getRawPageContent(pageIndex: number): RawMessage | undefined;
```

@remarks
Gets the {@link RawMessage} format content of a page for a
given index.

@param pageIndex
The index of the page.
@returns
The content of the page if a valid index is provided and it
is in {@link RawMessage} format, otherwise returns
undefined.
@throws This function can throw errors.

{@link InvalidItemStackError}
/

### `insertPage`
```ts
insertPage(pageIndex: number, content: (RawMessage | string)[] | RawMessage | string): void;
```

@remarks
Inserts a page at a given index. Empty pages will be created
if the index is greater than the current book size.
Pages have a maximum limit of 256 characters for strings as
well as the JSON representation of a {@link RawMessage}.
Books have a maximum limit of 50 pages.

This function can't be called in restricted-execution mode.

@param pageIndex
The index of the page.
@param content
The content to set for the page. Can be a single string or
{@link RawMessage} or an array of strings and/or {@link
RawMessage}s
@throws This function can throw errors.

{@link BookError}

{@link BookPageContentError}

{@link InvalidItemStackError}
/

### `removePage`
```ts
removePage(pageIndex: number): void;
```

@remarks
Removes a page at a given index. Existing pages following
this page will be moved backward to fill the empty space.

This function can't be called in restricted-execution mode.

@param pageIndex
The index of the page.
@throws This function can throw errors.

{@link InvalidItemStackError}
/

### `setContents`
```ts
setContents(contents: ((RawMessage | string)[] | RawMessage | string)[]): void;
```

@remarks
Sets the contents of the book's pages. Pre-existing pages
will be cleared.
Pages have a maximum limit of 256 characters for strings as
well as the JSON representation of a {@link RawMessage}.
Books have a maximum limit of 50 pages.

This function can't be called in restricted-execution mode.

@param contents
An array of each page's contents. Each page can be a single
string or {@link RawMessage} or an array of strings and/or
{@link RawMessage}s.
@throws This function can throw errors.

{@link BookError}

{@link BookPageContentError}

{@link InvalidItemStackError}
/

### `setPageContent`
```ts
setPageContent(pageIndex: number, content: (RawMessage | string)[] | RawMessage | string): void;
```

@remarks
Sets or creates the content of a specific page. Empty pages
will be created if the index is greater than the current
book size.
Pages have a maximum limit of 256 characters for strings as
well as the JSON representation of a {@link RawMessage}.
Books have a maximum limit of 50 pages.

This function can't be called in restricted-execution mode.

@param pageIndex
The index of the page.
@param content
The content to set for the page. Can be a single string or
{@link RawMessage} or an array of strings and/or {@link
RawMessage}s
@throws This function can throw errors.

{@link BookError}

{@link BookPageContentError}

{@link InvalidItemStackError}
/

### `signBook`
```ts
signBook(title: string, author: string): void;
```

@remarks
Signs a book giving it a title and author name. Once signed
players can no longer directly edit the book.
Titles have a maximum character limit of 16.

This function can't be called in restricted-execution mode.

@param title
The title to give the book.
@param author
The name of the book's author.
@throws This function can throw errors.

{@link BookError}

{@link InvalidEntityError}

{@link InvalidItemStackError}
/
