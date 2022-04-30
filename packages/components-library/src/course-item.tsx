import * as React from "react";
import { styled } from "@mui/system";
import Link from "next/link";
import { Grid, Typography } from "@mui/material";
import Image from "./image";
import type { Course, SiteInfo } from "@courselit/common-models";
import PriceTag from "./pricetag";

const PREFIX = "Course";

const classes = {
  link: `${PREFIX}-link`,
  featuredImage: `${PREFIX}-featuredImage`,
  title: `${PREFIX}-title`,
};

const StyledGrid = styled(Grid)(({ theme }: { theme: any }) => ({
  [`& .${classes.link}`]: {
    textDecoration: "none",
    color: "inherit",
    marginBottom: theme.spacing(2),
    display: "block",
  },

  [`& .${classes.featuredImage}`]: {
    height: "auto",
    width: "100%",
  },
}));

interface CourseItemProps {
  course: Course;
  siteInfo: SiteInfo;
  freeCostCaption?: string;
}

const CourseItem = (props: CourseItemProps) => {
  const { course, siteInfo, freeCostCaption } = props;

  return (
    <StyledGrid item xs={12} md={6}>
      <Link
        href={`/${course.isBlog ? "post" : "course"}/[id]/[slug]`}
        as={`/${course.isBlog ? "post" : "course"}/${course.courseId}/${
          course.slug
        }`}
      >
        <a className={classes.link}>
          <Grid
            item
            container
            direction="column"
            component="article"
            spacing={1}
          >
            {/* {course.featuredImage && (
                } */}
            <Grid item>
              <Image
                src={course.featuredImage && course.featuredImage.file}
                classes={classes.featuredImage}
              />
            </Grid>
            <Grid item>
              <Typography variant="overline">
                {course.isBlog ? "Post" : "Course"}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h4">{course.title}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1">{course.description}</Typography>
            </Grid>
            {!course.isBlog && (
              <Grid item>
                <PriceTag
                  cost={course.cost}
                  freeCostCaption={freeCostCaption}
                  siteInfo={siteInfo}
                />
              </Grid>
            )}
          </Grid>
        </a>
      </Link>
    </StyledGrid>
  );
};

export default CourseItem;