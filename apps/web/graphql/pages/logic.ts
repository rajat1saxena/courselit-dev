import { responses } from "../../config/strings";
import {
    checkIfAuthenticated,
    checkOwnershipWithoutModel,
    checkPermission,
} from "../../lib/graphql";
import GQLContext from "../../models/GQLContext";
import PageModel, { Page } from "../../models/Page";
import { Widget } from "../../models/Widget";
import { permissions } from "../../ui-config/constants";
import { getPageResponse } from "./helpers";
import constants from "../../config/constants";
import Course from "../../models/Course";
const { product } = constants;

export async function getPage({ id, ctx }: { id: string; ctx: GQLContext }) {
    let subdomainChanged = false;
    if (!ctx.subdomain.header) {
        ctx.subdomain.header = { name: "header", deleteable: false };
        subdomainChanged = true;
    }
    if (!ctx.subdomain.footer) {
        ctx.subdomain.footer = { name: "footer", deleteable: false };
        subdomainChanged = true;
    }
    if (subdomainChanged) {
        await (ctx.subdomain as any).save();
    }

    if (!id) {
        return {
            layout: [ctx.subdomain.header, ctx.subdomain.footer],
        };
    }

    if (
        ctx.user &&
        checkPermission(ctx.user.permissions, [permissions.manageSite])
    ) {
        const page = await PageModel.findOne(
            {
                pageId: id,
                domain: ctx.subdomain._id,
            },
            {
                pageId: 1,
                layout: 1,
                name: 1,
                type: 1,
                entityId: 1,
                draftLayout: 1,
            }
        );
        return getPageResponse(page, ctx);
    } else {
        const page = await PageModel.findOne(
            {
                pageId: id,
                domain: ctx.subdomain._id,
            },
            {
                pageId: 1,
                layout: 1,
                name: 1,
                type: 1,
                entityId: 1,
            }
        );
        if (page.type === product) {
            const course = await Course.findOne({ courseId: page.entityId });
            if (!course.published) {
                return;
            }
        }

        return getPageResponse(page, ctx);
    }
}

interface Draft {
    pageId: string;
    layout: string;
}

interface Published {
    pageId: string;
    publish: boolean;
}

export const savePage = async (
    pageData: Draft | Published,
    ctx: GQLContext
): Promise<Partial<Page> | null> => {
    const { pageId } = pageData;
    checkIfAuthenticated(ctx);
    if (!checkPermission(ctx.user.permissions, [permissions.manageSite])) {
        throw new Error(responses.action_not_allowed);
    }
    const page: Page | null = await PageModel.findOne({
        pageId,
        domain: ctx.subdomain._id,
    });

    if (!checkOwnershipWithoutModel(page, ctx)) {
        throw new Error(responses.item_not_found);
    }

    if ("publish" in pageData) {
        if (page && page.draftLayout.length) {
            page.layout = page.draftLayout;
            page.draftLayout = [];
        }
    } else if ("layout" in pageData) {
        try {
            let layout;
            try {
                layout = JSON.parse(pageData.layout);
            } catch (err) {
                throw new Error(responses.invalid_layout);
            }
            const header = layout.filter(
                (widget: Widget) => widget.name === "header"
            )[0];
            const footer = layout.filter(
                (widget: Widget) => widget.name === "footer"
            )[0];
            let subdomainChanged = false;
            if (header) {
                ctx.subdomain.header = header;
                subdomainChanged = true;
            }
            if (footer) {
                ctx.subdomain.footer = footer;
                subdomainChanged = true;
            }
            if (subdomainChanged) {
                await (ctx.subdomain as any).save();
            }
            page!.draftLayout = layout.filter(
                (widget: Widget) => !["header", "footer"].includes(widget.name)
            );
        } catch (err) {
            throw new Error(err.message);
        }
    }

    await (page as any).save();

    return getPageResponse(page!, ctx);
};

export const getPages = async (ctx: GQLContext) => {
    checkIfAuthenticated(ctx);
    if (!checkPermission(ctx.user.permissions, [permissions.manageSite])) {
        throw new Error(responses.action_not_allowed);
    }

    const pages: Page[] = await PageModel.find(
        {
            domain: ctx.subdomain._id,
        },
        {
            pageId: 1,
            name: 1,
            type: 1,
            entityId: 1,
        }
    );

    return pages;
};