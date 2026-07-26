/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "mutation SubmitForm($formId: ID!, $input: SubmitFormInput!) {\n  public {\n    form {\n      submit(formId: $formId, input: $input) {\n        success\n        message\n        submissionId\n        redirectUrl\n        accessToken\n        customer\n      }\n    }\n  }\n}": typeof types.SubmitFormDocument,
    "query PublicPageLayouts($workspaceSlug: String!, $pageSlug: String!, $previewSecret: String) {\n  public {\n    page {\n      layouts(\n        workspaceSlug: $workspaceSlug\n        pageSlug: $pageSlug\n        previewSecret: $previewSecret\n      ) {\n        position\n        blocks {\n          id\n          type\n          content\n          style\n          advanced\n          order\n          isActive\n        }\n        settings {\n          desktopWidth\n          mobileBehavior\n        }\n      }\n    }\n  }\n}": typeof types.PublicPageLayoutsDocument,
    "query PublicPageById($workspaceSlug: String!, $pageId: ID!) {\n  public {\n    page {\n      getById(workspaceSlug: $workspaceSlug, pageId: $pageId) {\n        id\n        publishedBlocks {\n          id\n          type\n          content\n          style\n          advanced\n        }\n      }\n    }\n  }\n}": typeof types.PublicPageByIdDocument,
    "query PublicPageId($workspaceSlug: String!, $slug: String!, $previewSecret: String) {\n  public {\n    page {\n      get(workspaceSlug: $workspaceSlug, slug: $slug, previewSecret: $previewSecret) {\n        id\n      }\n    }\n  }\n}": typeof types.PublicPageIdDocument,
    "query PublicPageMeta($workspaceSlug: String!, $slug: String!) {\n  public {\n    page {\n      get(workspaceSlug: $workspaceSlug, slug: $slug) {\n        seoTitle\n        seoDescription\n        seoKeywords\n        displayName\n      }\n    }\n  }\n}": typeof types.PublicPageMetaDocument,
    "query PublicPagesByType($workspaceId: String!, $parentSlug: String, $search: String, $limit: Int, $offset: Int, $sortBy: PageSortBy) {\n  public {\n    page {\n      byType(\n        workspaceId: $workspaceId\n        parentSlug: $parentSlug\n        search: $search\n        limit: $limit\n        offset: $offset\n        sortBy: $sortBy\n      ) {\n        items {\n          id\n          slug\n          fullSlug\n          publishedAt\n          displayName\n          seoTitle\n          seoDescription\n          customFields\n          pageType\n        }\n        total\n        hasMore\n      }\n    }\n  }\n}": typeof types.PublicPagesByTypeDocument,
    "query PublicPages($workspaceSlug: String!) {\n  public {\n    page {\n      list(workspaceSlug: $workspaceSlug) {\n        id\n        slug\n        updatedAt\n        publishedAt\n      }\n    }\n  }\n}": typeof types.PublicPagesDocument,
    "query PublicSiteConfig($workspaceSlug: String!) {\n  public {\n    siteConfig(workspaceSlug: $workspaceSlug) {\n      siteName\n      defaultLanguage\n      enabledLanguages\n      notFoundPageId\n      branding {\n        brandName\n        logoUrl\n        logoDarkUrl\n        faviconUrl\n        ogImageUrl\n      }\n    }\n  }\n}": typeof types.PublicSiteConfigDocument,
};
const documents: Documents = {
    "mutation SubmitForm($formId: ID!, $input: SubmitFormInput!) {\n  public {\n    form {\n      submit(formId: $formId, input: $input) {\n        success\n        message\n        submissionId\n        redirectUrl\n        accessToken\n        customer\n      }\n    }\n  }\n}": types.SubmitFormDocument,
    "query PublicPageLayouts($workspaceSlug: String!, $pageSlug: String!, $previewSecret: String) {\n  public {\n    page {\n      layouts(\n        workspaceSlug: $workspaceSlug\n        pageSlug: $pageSlug\n        previewSecret: $previewSecret\n      ) {\n        position\n        blocks {\n          id\n          type\n          content\n          style\n          advanced\n          order\n          isActive\n        }\n        settings {\n          desktopWidth\n          mobileBehavior\n        }\n      }\n    }\n  }\n}": types.PublicPageLayoutsDocument,
    "query PublicPageById($workspaceSlug: String!, $pageId: ID!) {\n  public {\n    page {\n      getById(workspaceSlug: $workspaceSlug, pageId: $pageId) {\n        id\n        publishedBlocks {\n          id\n          type\n          content\n          style\n          advanced\n        }\n      }\n    }\n  }\n}": types.PublicPageByIdDocument,
    "query PublicPageId($workspaceSlug: String!, $slug: String!, $previewSecret: String) {\n  public {\n    page {\n      get(workspaceSlug: $workspaceSlug, slug: $slug, previewSecret: $previewSecret) {\n        id\n      }\n    }\n  }\n}": types.PublicPageIdDocument,
    "query PublicPageMeta($workspaceSlug: String!, $slug: String!) {\n  public {\n    page {\n      get(workspaceSlug: $workspaceSlug, slug: $slug) {\n        seoTitle\n        seoDescription\n        seoKeywords\n        displayName\n      }\n    }\n  }\n}": types.PublicPageMetaDocument,
    "query PublicPagesByType($workspaceId: String!, $parentSlug: String, $search: String, $limit: Int, $offset: Int, $sortBy: PageSortBy) {\n  public {\n    page {\n      byType(\n        workspaceId: $workspaceId\n        parentSlug: $parentSlug\n        search: $search\n        limit: $limit\n        offset: $offset\n        sortBy: $sortBy\n      ) {\n        items {\n          id\n          slug\n          fullSlug\n          publishedAt\n          displayName\n          seoTitle\n          seoDescription\n          customFields\n          pageType\n        }\n        total\n        hasMore\n      }\n    }\n  }\n}": types.PublicPagesByTypeDocument,
    "query PublicPages($workspaceSlug: String!) {\n  public {\n    page {\n      list(workspaceSlug: $workspaceSlug) {\n        id\n        slug\n        updatedAt\n        publishedAt\n      }\n    }\n  }\n}": types.PublicPagesDocument,
    "query PublicSiteConfig($workspaceSlug: String!) {\n  public {\n    siteConfig(workspaceSlug: $workspaceSlug) {\n      siteName\n      defaultLanguage\n      enabledLanguages\n      notFoundPageId\n      branding {\n        brandName\n        logoUrl\n        logoDarkUrl\n        faviconUrl\n        ogImageUrl\n      }\n    }\n  }\n}": types.PublicSiteConfigDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation SubmitForm($formId: ID!, $input: SubmitFormInput!) {\n  public {\n    form {\n      submit(formId: $formId, input: $input) {\n        success\n        message\n        submissionId\n        redirectUrl\n        accessToken\n        customer\n      }\n    }\n  }\n}"): (typeof documents)["mutation SubmitForm($formId: ID!, $input: SubmitFormInput!) {\n  public {\n    form {\n      submit(formId: $formId, input: $input) {\n        success\n        message\n        submissionId\n        redirectUrl\n        accessToken\n        customer\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query PublicPageLayouts($workspaceSlug: String!, $pageSlug: String!, $previewSecret: String) {\n  public {\n    page {\n      layouts(\n        workspaceSlug: $workspaceSlug\n        pageSlug: $pageSlug\n        previewSecret: $previewSecret\n      ) {\n        position\n        blocks {\n          id\n          type\n          content\n          style\n          advanced\n          order\n          isActive\n        }\n        settings {\n          desktopWidth\n          mobileBehavior\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query PublicPageLayouts($workspaceSlug: String!, $pageSlug: String!, $previewSecret: String) {\n  public {\n    page {\n      layouts(\n        workspaceSlug: $workspaceSlug\n        pageSlug: $pageSlug\n        previewSecret: $previewSecret\n      ) {\n        position\n        blocks {\n          id\n          type\n          content\n          style\n          advanced\n          order\n          isActive\n        }\n        settings {\n          desktopWidth\n          mobileBehavior\n        }\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query PublicPageById($workspaceSlug: String!, $pageId: ID!) {\n  public {\n    page {\n      getById(workspaceSlug: $workspaceSlug, pageId: $pageId) {\n        id\n        publishedBlocks {\n          id\n          type\n          content\n          style\n          advanced\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query PublicPageById($workspaceSlug: String!, $pageId: ID!) {\n  public {\n    page {\n      getById(workspaceSlug: $workspaceSlug, pageId: $pageId) {\n        id\n        publishedBlocks {\n          id\n          type\n          content\n          style\n          advanced\n        }\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query PublicPageId($workspaceSlug: String!, $slug: String!, $previewSecret: String) {\n  public {\n    page {\n      get(workspaceSlug: $workspaceSlug, slug: $slug, previewSecret: $previewSecret) {\n        id\n      }\n    }\n  }\n}"): (typeof documents)["query PublicPageId($workspaceSlug: String!, $slug: String!, $previewSecret: String) {\n  public {\n    page {\n      get(workspaceSlug: $workspaceSlug, slug: $slug, previewSecret: $previewSecret) {\n        id\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query PublicPageMeta($workspaceSlug: String!, $slug: String!) {\n  public {\n    page {\n      get(workspaceSlug: $workspaceSlug, slug: $slug) {\n        seoTitle\n        seoDescription\n        seoKeywords\n        displayName\n      }\n    }\n  }\n}"): (typeof documents)["query PublicPageMeta($workspaceSlug: String!, $slug: String!) {\n  public {\n    page {\n      get(workspaceSlug: $workspaceSlug, slug: $slug) {\n        seoTitle\n        seoDescription\n        seoKeywords\n        displayName\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query PublicPagesByType($workspaceId: String!, $parentSlug: String, $search: String, $limit: Int, $offset: Int, $sortBy: PageSortBy) {\n  public {\n    page {\n      byType(\n        workspaceId: $workspaceId\n        parentSlug: $parentSlug\n        search: $search\n        limit: $limit\n        offset: $offset\n        sortBy: $sortBy\n      ) {\n        items {\n          id\n          slug\n          fullSlug\n          publishedAt\n          displayName\n          seoTitle\n          seoDescription\n          customFields\n          pageType\n        }\n        total\n        hasMore\n      }\n    }\n  }\n}"): (typeof documents)["query PublicPagesByType($workspaceId: String!, $parentSlug: String, $search: String, $limit: Int, $offset: Int, $sortBy: PageSortBy) {\n  public {\n    page {\n      byType(\n        workspaceId: $workspaceId\n        parentSlug: $parentSlug\n        search: $search\n        limit: $limit\n        offset: $offset\n        sortBy: $sortBy\n      ) {\n        items {\n          id\n          slug\n          fullSlug\n          publishedAt\n          displayName\n          seoTitle\n          seoDescription\n          customFields\n          pageType\n        }\n        total\n        hasMore\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query PublicPages($workspaceSlug: String!) {\n  public {\n    page {\n      list(workspaceSlug: $workspaceSlug) {\n        id\n        slug\n        updatedAt\n        publishedAt\n      }\n    }\n  }\n}"): (typeof documents)["query PublicPages($workspaceSlug: String!) {\n  public {\n    page {\n      list(workspaceSlug: $workspaceSlug) {\n        id\n        slug\n        updatedAt\n        publishedAt\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query PublicSiteConfig($workspaceSlug: String!) {\n  public {\n    siteConfig(workspaceSlug: $workspaceSlug) {\n      siteName\n      defaultLanguage\n      enabledLanguages\n      notFoundPageId\n      branding {\n        brandName\n        logoUrl\n        logoDarkUrl\n        faviconUrl\n        ogImageUrl\n      }\n    }\n  }\n}"): (typeof documents)["query PublicSiteConfig($workspaceSlug: String!) {\n  public {\n    siteConfig(workspaceSlug: $workspaceSlug) {\n      siteName\n      defaultLanguage\n      enabledLanguages\n      notFoundPageId\n      branding {\n        brandName\n        logoUrl\n        logoDarkUrl\n        faviconUrl\n        ogImageUrl\n      }\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;