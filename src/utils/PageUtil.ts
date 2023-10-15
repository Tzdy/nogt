import { PageVO } from 'src/models/page.vo';

export class PagePlugin {
  page: number;
  pageSize: number;
  total: number;
}

export const pageHelper = {
  page: null as null | PagePlugin,
};

export class PageUtil {
  static page(vo: Partial<PageVO>) {
    return {
      pageSize: vo.pageSize,
      page: (vo.page - 1) * vo.pageSize,
    };
  }

  static pagePlugin(vo: Partial<PageVO>) {
    const page = {
      ...this.page(vo),
      total: 0,
    };
    pageHelper.page = page;
    return page;
  }
}
