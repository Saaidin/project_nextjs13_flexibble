import { AllProjectsType } from "@/common.types";
import HomeFilter from "@/components/HomeFilter";
// import LoadMore from "@/components/LoadMore";
import ProjectCard from "@/components/ProjectCard";
import { getProjectsQuery  } from "@/graphql/query";
// import { GraphQLClient } from "graphql-request";
import { getApiConfig } from "@/lib/utils";

export const dynamic = 'force-dynamic'

type SearchParams = {
  category?: string | null;
  cursor?: string | null;
}

type Props = {
  searchParams: SearchParams
}

// const query = `{
//   projectCollection(last: 10) {
//     edges {
//       node {
//         title
//         description
//         id
//         image
//         category
//         liveSiteUrl
//         githubUrl
//         createdBy {
//           name
//           email
//           id
//           avatarUrl
//         }
//       }
//     }
//   }
// }`

const Home = async ({ searchParams }: Props) => {
  let category = searchParams.category || null;
  let cursor = searchParams.cursor || null
  
  const { apiUrl, apiKey } = await getApiConfig();

  const headers = {
    'Content-Type': 'application/graphql',
    'x-api-key': apiKey
  };
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ query: getProjectsQuery(category, cursor) }),
    cache: 'no-store' 
  });
  
  const { data } = await response.json();

  const projectsToDisplay = data?.projectSearch?.edges || [];

  console.log({ numberOfProjects: projectsToDisplay.length, projectsToDisplay})

  if (projectsToDisplay.length === 0) {
    return (
      <section className="flexStart flex-col paddings">
        <HomeFilter />
        <p className="no-result-text text-center">Sorry no projects found</p>
      </section>
    )
  }

  return (
    <section className="flexStart flex-col paddings mb-16">
      <HomeFilter />
      <section className="projects-grid">
        {projectsToDisplay.map(({ node }: AllProjectsType) => (
          <ProjectCard
            key={`${node?.id}`}
            id={node?.id}
            image={node?.image}
            title={node?.title}
            name={node?.createdBy.name}
            avatarUrl={node?.createdBy.avatarUrl}
            userId={node?.createdBy.id}
          />
        ))}
      </section>
      {/* {data?.projectSearch?.pageInfo?.hasNextPage && (
        <LoadMore cursor={data?.projectSearch?.pageInfo?.endCursor} />
      )} */}
    </section>
  )
};

export default Home;
