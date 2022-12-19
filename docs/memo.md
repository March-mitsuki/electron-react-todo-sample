# logic memo

1. uesr right click (open ctx-menu)
1. click edit
1. dispatch todo.id to store
1. store save todo id and set form type to edit
1. form open and check type is edit
1. find current todo in state.todos
1. display current todo in form

# coding stand

- firebase:

  - client todo class do not include server side cloum (ex: created_at, updated_at, deleted_at, ...etc)

- user setting:

  - local 和 timezone 的设定全放到 user setting 里, 不放到每个 todo 里
    - 但是 finish_date_obj 怎么办?

- Todo
  - [ ] 多国语言支持
    - [ ] 目前只支持中文
